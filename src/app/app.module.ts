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
  DashboardCellParams,
  DEFAULT_COLUMNS_NUMBER,
  DEFAULT_ROWS_NUMBER,
  filterLoader,
  PryCoreModule,
  PryDashboardModule,
  PryHiddenWhenOverlay,
  PryHttpErrorInterceptorService,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PrySelectModule,
  tooltipLoader,
  WidgetLayout,
  widgetLoader,
  WidgetManifest
} from '@provoly/dashboard';
import { PryCardModule } from '@provoly/dashboard/components/card';
import { PryExpandPanelModule } from '@provoly/dashboard/components/expand-panel';
import { PryImportModule } from '@provoly/dashboard/import';
import { PryNotificationModule } from '@provoly/dashboard/notification';
import { PryPipelineModule } from '@provoly/dashboard/pipeline';
import { PryPipelineFilterModule } from '@provoly/dashboard/pipeline-components/filter';
import { PryPipelineInputDatasetModule } from '@provoly/dashboard/pipeline-components/input-datasource';
import { PryPipelineNoopModule } from '@provoly/dashboard/pipeline-components/noop';
import { PryPipelineOutputDatasetModule } from '@provoly/dashboard/pipeline-components/output-dataset/output-dataset.module';
import { PryPipelineSubgraphModule } from '@provoly/dashboard/pipeline-components/subgraph';
import { PryPresentationModule } from '@provoly/dashboard/presentation';
import { PrySearchModule } from '@provoly/dashboard/search';
import { PryToolboxModule } from '@provoly/dashboard/toolbox';
import {
  PryAggregationService,
  PryBackendAggregationService
} from '@provoly/dashboard/widgets/widget-aggregated-chart';
import { PryDatasetModule } from '../../projects/provoly/dashboard/dataset';
import { PryRestitutionModule } from '../../projects/provoly/dashboard/restitution';
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
    StoreDevtoolsModule.instrument({maxAge: 200}),
    PrySearchModule,
    PryDashboardModule.forRoot(
      {
        chart: {
          name: 'chart',
          load: () =>
            import('@provoly/dashboard/widgets/widget-aggregated-chart').then((module) =>
              widgetLoader(module, 'WidgetAggregatedChartModule')
            )
        },
        'chart-legacy': {
          name: 'chart-legacy',
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
            import('@provoly/dashboard/widgets/widget-map').then((module) => widgetLoader(module, 'WidgetMapModule'))
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
        }
      },
      {
        path: 'dashboard',
        mapUrl: 'https://map.yap.pangee.ovh',
        pryUrl: 'http://localhost:8081',
        wsUrl: 'ws://localhost:8082',
        geoServerUrl: 'https://geo.proto.pangee.ovh/geoserver'
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
        }
      },
      [
        {
          type: '2/1',
          image: 'assets/svgs/grid_2_gauche_1_droite.svg',
          sizeImpl: (
            outLayout: { x: number; y: number; height: number; width: number },
            params: Partial<DashboardCellParams>
          ) => {
            return [
              {
                ...outLayout,
                height: Math.floor((params.rows ?? DEFAULT_ROWS_NUMBER) / 2),
                width: Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2)
              },
              {
                ...outLayout,
                height: Math.floor((params.rows ?? DEFAULT_ROWS_NUMBER) / 2),
                width: Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2)
              },
              {
                ...outLayout,
                height: params.rows ?? DEFAULT_ROWS_NUMBER,
                width: Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2)
              }
            ];
          },
          placementImpl: (
            widgetToPlace: WidgetManifest,
            sizes: WidgetLayout[],
            params: Partial<DashboardCellParams>
          ) => [
            { ...widgetToPlace, layout: { ...widgetToPlace.layout, ...sizes[0], x: 1, y: 1 }},
            {
              ...widgetToPlace,
              layout: {
                ...widgetToPlace.layout,
                ...sizes[1],
                x: 1,
                y: Math.floor((params.columns ?? DEFAULT_COLUMNS_NUMBER) / 2) + 1
              }
            },
            {
              ...widgetToPlace,
              layout: {
                ...widgetToPlace.layout,
                ...sizes[2],
                x: Math.floor((params.rows ?? DEFAULT_ROWS_NUMBER) / 2) + 1,
                y: 1
              }
            }
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
    PryDatasetModule
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
    this.translateService.use('fr');
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
