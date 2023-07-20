import { Inject, Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { BehaviorSubject, from, map, Observable, of } from 'rxjs';
import { WidgetManifest } from '../../../../core/model/manifest.interface';
import { BaseWidgetComponent } from '../base-widget.component';
import { WidgetFillerComponent } from '../widget-filler/widget-filler.component';
import { WidgetPlaceholderComponent } from '../widget-placeholder/widget-placeholder.component';
import { WidgetDefinition, WidgetLazyDefinition, WidgetStaticDefinition } from './widgets-definition.model';

export const WIDGET_DEFINITION = new InjectionToken<string>('Widgets definition');

@Injectable({
  providedIn: 'root'
})
export class WidgetFactoryService {
  reference$ = new BehaviorSubject<{ [key: string]: WidgetDefinition }>({
    placeholder: { name: 'placeholder', component: WidgetPlaceholderComponent },
    filler: { name: 'filler', component: WidgetFillerComponent }
  });
  moduleRefCache = {} as { [manifestType: string]: Type<BaseWidgetComponent> };

  constructor(
    private injector: Injector,
    @Inject(WIDGET_DEFINITION) reference: { [key: string]: WidgetDefinition }
  ) {
    this.putDefinitions(reference);
  }

  resolveComponent(manifest: WidgetManifest) {
    if (this.moduleRefCache[manifest.type]) {
      return of(this.moduleRefCache[manifest.type]);
    }
    if (!!manifest && this.reference$.getValue()[manifest.type]) {
      // @ts-ignore
      if (this.reference$.getValue()[manifest.type].load === undefined) {
        this.moduleRefCache[manifest.type] = (
          this.reference$.getValue()[manifest.type] as WidgetStaticDefinition
        ).component;
        return of(this.moduleRefCache[manifest.type]);
      } else {
        return from(
          (this.reference$.getValue()[manifest.type] as WidgetLazyDefinition).load().then((fn) => {
            this.moduleRefCache[manifest.type] = fn(this.injector);
            return this.moduleRefCache[manifest.type];
          })
        );
      }
    } else {
      this.moduleRefCache[manifest.type] = (
        this.reference$.getValue()['placeholder'] as WidgetStaticDefinition
      ).component;
      return of(this.moduleRefCache[manifest.type]);
    }
  }

  private putDefinitions(definitions: { [key: string]: WidgetDefinition }) {
    this.reference$.next({
      ...this.reference$.getValue(),
      ...definitions
    });
  }

  isModuleLoaded(type: string): Observable<boolean> {
    return this.reference$.pipe(map((componentDefs) => !!componentDefs[type]));
  }
}
