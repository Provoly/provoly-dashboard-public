import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  filterLoader,
  PryAboutModule,
  PryAggregationService,
  PryBackendAggregationService,
  PryCoreModule,
  PryDashboardModule,
  PryHiddenWhenOverlay,
  PryHttpErrorInterceptorService,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PrySelectModule,
  tooltipLoader,
  widgetLoader
} from '@provoly/dashboard';
import { PryCardModule } from '@provoly/dashboard/components/card';
import { PryExpandPanelModule } from '@provoly/dashboard/components/expand-panel';
import { PryDatasetModule } from '@provoly/dashboard/dataset';
import { PryImportModule } from '@provoly/dashboard/import';
import { PryNotificationModule } from '@provoly/dashboard/notification';
import { PryPipelineModule } from '@provoly/dashboard/pipeline';
import { PryPipelineFilterModule } from '@provoly/dashboard/pipeline-components/filter';
import { PryPipelineInputDatasetModule } from '@provoly/dashboard/pipeline-components/input-datasource';
import { PryPipelineNoopModule } from '@provoly/dashboard/pipeline-components/noop';
import { PryPipelineOutputDatasetModule } from '@provoly/dashboard/pipeline-components/output-dataset';
import { PryPipelineSubgraphModule } from '@provoly/dashboard/pipeline-components/subgraph';
import { PryPresentationModule } from '@provoly/dashboard/presentation';
import { PryRestitutionModule } from '@provoly/dashboard/restitution';
import { PrySearchModule } from '@provoly/dashboard/search';
import { PryToolboxModule } from '@provoly/dashboard/toolbox';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth.interceptor';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { SearchContainerComponent } from './search-container/search-container.component';

@NgModule({
  declarations: [AppComponent, DashboardContainerComponent, SearchContainerComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 200 }),
    PrySearchModule,
    PryDashboardModule.forRoot(
      {
        chart: {
          name: 'chart',
          load: () =>
            import('@provoly/dashboard/widgets/widget-aggregated-chart').then((module) =>
              widgetLoader(module, 'WidgetAggregatedChartModule')
            ),
          autoLoadDatasource: 'aggregate'
        },
        'legacy-chart': {
          name: 'legacy-chart',
          load: () =>
            import('@provoly/dashboard/widgets/widget-chart').then((module) =>
              widgetLoader(module, 'WidgetChartModule')
            )
        },
        detail: {
          name: 'detail',
          load: () =>
            import('@provoly/dashboard/widgets/widget-detail').then((module) =>
              widgetLoader(module, 'WidgetDetailModule')
            )
        },
        graph: {
          name: 'graph',
          load: () =>
            import('@provoly/dashboard/widgets/widget-graph').then((module) =>
              widgetLoader(module, 'WidgetGraphModule')
            )
        },
        iframe: {
          name: 'iframe',
          load: () =>
            import('@provoly/dashboard/widgets/widget-iframe').then((module) =>
              widgetLoader(module, 'WidgetIframeModule')
            )
        },
        image: {
          name: 'image',
          load: () =>
            import('@provoly/dashboard/widgets/widget-image').then((module) =>
              widgetLoader(module, 'WidgetImageModule')
            )
        },
        map: {
          name: 'map',
          load: () =>
            import('@provoly/dashboard/widgets/widget-map').then((module) => widgetLoader(module, 'WidgetMapModule')),
          autoLoadDatasource: 'not-geo'
        },
        table: {
          name: 'table',
          load: () =>
            import('@provoly/dashboard/widgets/widget-table').then((module) =>
              widgetLoader(module, 'WidgetTableModule')
            )
        },
        template: {
          name: 'template',
          load: () =>
            import('@provoly/dashboard/widgets/widget-template').then((module) =>
              widgetLoader(module, 'WidgetTemplateModule')
            )
        },
        tile: {
          name: 'tile',
          load: () =>
            import('@provoly/dashboard/widgets/widget-tile').then((module) => widgetLoader(module, 'WidgetTileModule'))
        },
        vega: {
          name: 'vega',
          load: () =>
            import('@provoly/dashboard/widgets/widget-vega').then((module) => widgetLoader(module, 'WidgetVegaModule'))
        }
      },
      {
        path: 'dashboard',
        mapUrl: 'https://maps.provoly.net',
        pryUrl: 'http://localhost:8081',
        wsUrl: 'ws://localhost:8082',
        geoServerUrl: 'https://geo.dev.provoly.net/geoserver'
      },
      {
        attribute: {
          name: 'attribute',
          load: () =>
            import('@provoly/dashboard/tooltips/attribute').then((module) =>
              tooltipLoader(module, 'PryAttributeTooltipModule')
            )
        }
      },
      {
        text: {
          name: 'text',
          load: () =>
            import('@provoly/dashboard/filters/text').then((module) => filterLoader(module, 'PryTextFilterModule'))
        },
        date: {
          name: 'date',
          load: () =>
            import('@provoly/dashboard/filters/date').then((module) => filterLoader(module, 'PryDateFilterModule'))
        },
        list: {
          name: 'list',
          load: () =>
            import('@provoly/dashboard/filters/list').then((module) => filterLoader(module, 'PryListFilterModule'))
        },
        number: {
          name: 'number',
          load: () =>
            import('@provoly/dashboard/filters/number').then((module) => filterLoader(module, 'PryNumberFilterModule'))
        },
        autocomplete: {
          name: 'autocomplete',
          load: () =>
            import('@provoly/dashboard/filters/autocomplete').then((module) =>
              filterLoader(module, 'PryAutocompleteModule')
            )
        }
      },
      [
        {
          type: '2/1',
          label: '@pry.toolbox.layout.2/1',
          description: '@pry.toolbox.layout.2/1_detailled',
          rows: 2,
          columns: 2,
          places: [
            { x: 1, y: 1, width: 1, height: 1 },
            { x: 1, y: 2, width: 1, height: 1 },
            { x: 2, y: 1, width: 1, height: 2 }
          ]
        }
      ]
    ),
    BrowserAnimationsModule,
    PryToolboxModule,
    PryCardModule,
    PryExpandPanelModule,
    FormsModule,
    PryIconModule,
    PryCoreModule.forRoot({
      // accessProvider: { provide: PRY_ACCESS_TOKEN, useClass: PryDashboardRoleService },
      // guardProvider: { provide: PRY_ACCESS_GUARD, useClass: PryDashboardAccessGuard }
    }),
    PryI18nModule,
    PrySelectModule,
    PrySearchModule,
    PryNotificationModule,
    PryHiddenWhenOverlay,
    PryRestitutionModule,
    PryImportModule,
    PryPresentationModule,
    PryPipelineModule,
    PryPipelineSubgraphModule,
    PryPipelineInputDatasetModule,
    PryPipelineOutputDatasetModule,
    PryPipelineFilterModule,
    PryPipelineNoopModule,
    PryDatasetModule,
    PryAboutModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PryHttpErrorInterceptorService,
      multi: true
    },
    { provide: PryAggregationService, useClass: PryBackendAggregationService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private translateService: PryI18nService) {
    this.translateService.addLangObject('fr', 'custom-grid', {
      '@pry': {
        toolbox: {
          layout: {
            '2/1': '2 à gauche, 1 à droite',
            '2/1_detailled':
              'Affichage de 2 restitutions sur la partie gauche, et un sur la partie droite. Le placement est guidé par le système.'
          }
        }
      }
    });
  }
}
