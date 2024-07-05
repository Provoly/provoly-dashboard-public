import { ComponentRef, Inject, Injectable, InjectionToken, Injector, Type, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, from, map, Observable, of } from 'rxjs';
import { TooltipOfClass } from '../../core/model/tooltip-of-class.interface';
import { ConfigSelectors } from '../../core/store/config/config.selectors';
import { BaseTooltipComponent } from './base-tooltip.component';
import { DefaultTooltipComponent } from './components/default/default.tooltip.component';

export const TOOLTIP_DEFINITION = new InjectionToken<string>('Tooltip definition');

export type TooltipStaticDefinition = {
  name: string;
  component: Type<BaseTooltipComponent>;
};
export type TooltipLazyDefinition = {
  name: string;
  load: () => Promise<(injector: Injector) => Type<BaseTooltipComponent>>;
};
export type TooltipDefinition = TooltipStaticDefinition | TooltipLazyDefinition;

@Injectable({
  providedIn: 'root'
})
export class TooltipFactoryService {
  reference$ = new BehaviorSubject<{ [key: string]: TooltipDefinition }>({
    default: { name: 'default', component: DefaultTooltipComponent },
    none: { name: 'none', component: null as unknown as Type<BaseTooltipComponent> }
  });
  types$: Observable<string[]>;
  defs: { [p: string]: TooltipOfClass } = {};
  moduleRefCache = {} as { [manifestType: string]: Type<BaseTooltipComponent> };

  constructor(
    private injector: Injector,
    @Inject(TOOLTIP_DEFINITION) reference: { [key: string]: TooltipDefinition },
    private store: Store
  ) {
    this.putDefinitions(reference);
    this.types$ = this.reference$.pipe(map((defs) => Object.keys(defs)));
    this.store.select(ConfigSelectors.tooltipDefinitions).subscribe((defs) => (this.defs = defs));
  }

  resolveComponent(_type: string) {
    let type = _type;
    if (this.moduleRefCache[type]) {
      return of(this.moduleRefCache[type]);
    }
    if (!this.reference$.getValue()[type]) {
      type = 'default';
    }
    // @ts-ignore
    if (this.reference$.getValue()[type].load === undefined) {
      this.moduleRefCache[type] = (this.reference$.getValue()[type] as TooltipStaticDefinition).component;
      return of(this.moduleRefCache[type]);
    } else {
      return from(
        (this.reference$.getValue()[type] as TooltipLazyDefinition).load().then((fn) => {
          this.moduleRefCache[type] = fn(this.injector);
          return this.moduleRefCache[type];
        })
      );
    }
  }

  private putDefinitions(definitions: { [key: string]: TooltipDefinition }) {
    this.reference$.next({
      ...this.reference$.getValue(),
      ...definitions
    });
  }

  isModuleLoaded(type: string): Observable<boolean> {
    return this.reference$.pipe(map((componentDefs) => !!componentDefs[type]));
  }

  generateTooltip(
    type: string, // class id
    parentInjector: Injector,
    container: ViewContainerRef
  ): Observable<ComponentRef<BaseTooltipComponent> | null> {
    const definition = this.defs[type] ?? { type };
    return this.resolveComponent(definition.type).pipe(
      map((component) => {
        if (component) {
          const tmpComponent = container.createComponent<BaseTooltipComponent>(component);
          tmpComponent.instance.context = definition.options;
          return tmpComponent;
        }
        return null;
      })
    );
  }

  addTooltipDefinitions(defs: { [key: string]: TooltipDefinition }) {
    this.reference$.next({ ...this.reference$.getValue(), ...defs });
  }
}
