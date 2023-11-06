import { Inject, Injectable, InjectionToken, Injector, Type } from '@angular/core';
import { BehaviorSubject, from, map, Observable, of } from 'rxjs';
import { WidgetManifest } from '../../../../core/model/manifest.interface';
import { BaseWidgetComponent } from '../base-widget.component';
import { WidgetFillerComponent } from '../widget-filler/widget-filler.component';
import { WidgetPlaceholderComponent } from '../widget-placeholder/widget-placeholder.component';
import { WidgetDefinition, WidgetLazyDefinition, WidgetStaticDefinition } from './widgets-definition.model';
import { DatasourceUtils } from '../../../../core/store/data-source/datasource-utils';
import { DataSourceSelectors } from '../../../../core/store/data-source/data-source.selectors';
import { Store } from '@ngrx/store';
import { DataSource } from '../../../../core/store/data-source/data-source.model';

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
  datasources: DataSource[] = [];

  constructor(
    private injector: Injector,
    @Inject(WIDGET_DEFINITION) reference: { [key: string]: WidgetDefinition },
    private store: Store
  ) {
    this.putDefinitions(reference);
    this.store.select(DataSourceSelectors.getDataSources).subscribe((datasources) => (this.datasources = datasources));
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

  datasourcesToAutoLoad(manifest: WidgetManifest) {
    const widgetDefinition = this.reference$.getValue()[manifest.type];
    const datasourcesArray: string[] = Array.isArray(manifest.datasource ?? [])
      ? ((manifest.datasource ?? []) as string[])
      : ([manifest.datasource] as string[]);
    return datasourcesArray.filter((datasource) => {
      const matching = this.datasources.find((ds) => ds.id === datasource)!;
      return (
        widgetDefinition.autoLoadDatasource === undefined ||
        widgetDefinition.autoLoadDatasource === 'all' ||
        (widgetDefinition.autoLoadDatasource === 'geo' && DatasourceUtils.isGeo(matching)) ||
        (widgetDefinition.autoLoadDatasource === 'not-geo' && !DatasourceUtils.isGeo(matching))
      );
    });
  }
}
