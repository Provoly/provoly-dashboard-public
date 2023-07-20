import { ComponentRef, Inject, Injectable, InjectionToken, Injector, Type, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, from, map, Observable, of } from 'rxjs';
import { ConfigSelectors } from '../../core/store/config/config.selectors';
import { BaseFilterComponent } from './base-filter.component';

export const FILTER_DEFINITION = new InjectionToken<string>('Filter definition');

export type FilterStaticDefinition = {
  name: string;
  component: Type<BaseFilterComponent>;
};
export type FilterLazyDefinition = {
  name: string;
  load: () => Promise<(injector: Injector) => Type<BaseFilterComponent>>;
};
export type FilterDefinition = FilterStaticDefinition | FilterLazyDefinition;

@Injectable({
  providedIn: 'root'
})
export class FilterFactoryService {
  reference$ = new BehaviorSubject<{ [key: string]: FilterDefinition }>({});
  types$: Observable<string[]>;
  //TODO changer le any
  defs: { [p: string]: any } = {};
  moduleRefCache = {} as { [manifestType: string]: Type<BaseFilterComponent> };

  constructor(
    private injector: Injector,
    @Inject(FILTER_DEFINITION) reference: { [key: string]: FilterDefinition },
    private store: Store
  ) {
    this.putDefinitions(reference);
    this.types$ = this.reference$.pipe(map((defs) => Object.keys(defs)));
    this.store.select(ConfigSelectors.filterDefinitions).subscribe((defs) => (this.defs = defs));
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
      this.moduleRefCache[type] = (this.reference$.getValue()[type] as FilterStaticDefinition).component;
      return of(this.moduleRefCache[type]);
    } else {
      return from(
        (this.reference$.getValue()[type] as FilterLazyDefinition).load().then((fn) => {
          this.moduleRefCache[type] = fn(this.injector);
          return this.moduleRefCache[type];
        })
      );
    }
  }

  private putDefinitions(definitions: { [key: string]: FilterDefinition }) {
    this.reference$.next({
      ...this.reference$.getValue(),
      ...definitions
    });
  }

  generateFilter(
    type: string,
    parentInjector: Injector,
    container: ViewContainerRef
  ): Observable<ComponentRef<BaseFilterComponent>> {
    const definition = this.defs[type] ?? { type };
    return this.resolveComponent(definition.type).pipe(
      map((component) => {
        const tmpComponent = container.createComponent<BaseFilterComponent>(component);
        return tmpComponent;
      })
    );
  }

  addFilterDefinitions(defs: { [key: string]: FilterDefinition }) {
    this.reference$.next({ ...this.reference$.getValue(), ...defs });
  }
}
