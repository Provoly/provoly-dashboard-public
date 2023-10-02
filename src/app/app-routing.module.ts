import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardManifest, DefaultViewGuard, Filter, PRY_ACCESS_GUARD, TooltipMode } from '@provoly/dashboard';
import { PryImportComponent } from '@provoly/dashboard/import';
import { PryPipelineListComponent } from '@provoly/dashboard/pipeline';
import { PryPresentationComponent } from '@provoly/dashboard/presentation';
import { PrySearchToolsComponent } from '@provoly/dashboard/search';
import { PryDatasetComponent } from '../../projects/provoly/dashboard/dataset';
import {
  PryRestitutionCatalogComponent,
  PryRestitutionListComponent
} from '../../projects/provoly/dashboard/restitution';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { SearchContainerComponent } from './search-container/search-container.component';
import { vegaExampleSpec } from './vega-example-spec.constant';

const routes: Routes = [
  /* In a real app, do not make routes like these ones */
  {
    path: '',
    canActivate: [DefaultViewGuard],
    component: DashboardContainerComponent,
    data: {}
  },
  {
    path: 'map',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        grid: {
          rows: 10
        },
        widgets: [
          {
            type: 'map',
            layout: {
              x: 1,
              y: 1,
              height: 10,
              width: 12
            },
            options: {
              style: '_url',
              styleURL: 'http://localhost:8081/external/style.json',
              attributions: true,
              tooltipMode: TooltipMode.CLICK,
              layers: [
                {
                  type: 'marker'
                },
                {
                  type: 'marker'
                },
                {
                  type: 'heatmap',
                  classes: ['17b90da3-f448-4cc3-bfd8-74c8b8481590']
                },
                {
                  type: 'bubble',
                  classes: ['06406e7e-37cd-41ce-b5fc-36d233e5ae5c'],
                  opacity: 50
                },
                {
                  type: 'relation',
                  active: false
                },
                {
                  type: 'geoserver',
                  key: 'CKDo:NappePhréatique',
                  opacity: 50
                },
                {
                  type: 'wms',
                  opacity: 50,
                  paramLayer: 'CADASTRALPARCELS.PARCELLAIRE_EXPRESS',
                  url: 'https://wxs.ign.fr/parcellaire/geoportail/r/wms',
                  paramTiled: true
                },
                {
                  type: 'wms',
                  opacity: 10,
                  paramLayer: 'ac:243300316_072022',
                  url: 'https://geo.demo.pangee.ovh/geoserver/alter-carbon/wms',
                  paramTiled: true
                }
              ],
              fit: true
            },
            datasource: ['29061554-298f-4f56-8cd2-51ccec998303', 's6406e7e-37cd-41ce-b5fc-36d233e6ae5c']
          }
        ]
      } as DashboardManifest,
      filters: [
        {
          id: '6ce14ac6-39a9-43c0-96b5-ef11fb47bf82',
          name: 'sub',
          type: 'text',
          operator: 'EQUALS',
          value: 'SUBMERSION',
          attributes: [
            {
              id: '4c87f8bc-f30e-4875-b03b-9c4fa97d7288',
              name: 'id',
              label: 'id / Submersion / tronçon_de_route',
              datasource: 's6406e7e-37cd-41ce-b5fc-36d233e6ae5c'
            },
            {
              id: '4c87f8bc-f30e-4875-b03b-9c4fa97d7289',
              name: 'id2',
              label: 'id2 / Submersion / tronçon_de_route',
              datasource: 's6406e7e-37cd-41ce-b5fc-36d233e6ae5c'
            }
          ]
        },
        {
          id: '3bc03f8a-6f8c-4cc1-ad58-7ea1ec5adeaa',
          name: 'aze',
          type: 'date',
          operator: 'INSIDE',
          hasDateRange: true,
          value: '2023-09-06,2023-09-09',
          attributes: [
            {
              id: '4c87f8bc-f30e-4875-b03b-9c4fa97d7281',
              name: 'id',
              label: 'id / Submersion / tronçon_de_route',
              datasource: 's6406e7e-37cd-41ce-b5fc-36d233e6ae5c'
            },
            {
              id: '4c87f8bc-f30e-4875-b03b-9c4fa97d7282',
              name: 'id2',
              label: 'id2 / Submersion / tronçon_de_route',
              datasource: 's6406e7e-37cd-41ce-b5fc-36d233e6ae5c'
            }
          ]
        }
      ] as Filter[]
    }
  },
  {
    path: 'table',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        grid: {
          rows: 10
        },
        widgets: [
          {
            type: 'table',
            layout: { x: 1, y: 1, height: 10, width: 12 },
            options: {},
            datasource: ['06406e7e-37cd-41ce-b5fc-36d233e5ae5c']
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'chart',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'chart',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: {
              title: 'test',
              ordinate: {
                attribute: 'da314951-82cb-4e93-9955-4654993f231c',
                operation: 'none',
                label: 'Température'
              },
              abscissa: {
                attribute: 'd5d4cda4-7ff3-4f19-ab69-7c95745888cf',
                label: 'Date'
              },
              graph: {
                offset: true,
                stacked: true
              },
              groupBy: {
                attribute: 'eothr951-82cb-4e93-9955-4654993f231c'
              }
            },
            datasource: 'graphspe-cifi-cdat-acd2-51ccec998307'
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'chart-legacy',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        grid: {
          gap: 30,
          rows: 5,
          columns: 5
        },
        widgets: [
          {
            type: 'chart-legacy',
            layout: { x: 1, y: 1, height: 5, width: 5 },
            options: {
              title: 'value_dec_2, value_long',
              type: 'line',
              subType: 'default',
              series: {
                groupBy: 'seriesName'
              },
              selectedVariables: [
                {
                  type: 'quantitative',
                  label: 'value_dec_2',
                  name: 'value_dec_2'
                },
                {
                  label: 'value_long',
                  name: 'value_long',
                  type: 'quantitative',
                  axisOptions: {
                    tickMinStep: 1
                  }
                }
              ],
              aggregation: 'sum',
              customTitle: 'Titre de mon graphique',
              specToMerge: {
                scales: [
                  {
                    name: 'color',
                    type: 'ordinal',
                    domain: {
                      data: 'table',
                      field: 'id'
                    },
                    range: {
                      scheme: 'category20'
                    }
                  }
                ]
              },
              tooltip: true,
              legend: true
            },
            datasource: 'graphspe-cifi-cdat-acd2-51ccec998307'
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'graph',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'graph',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: { layout: 'simple' },
            datasource: '39061554-298f-4f56-8cd2-51ccec998307'
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'geo',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'map',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: {
              attributions: true,
              tooltipMode: TooltipMode.CLICK,
              layers: [
                {
                  type: 'point'
                },
                {
                  type: 'line'
                },
                {
                  type: 'polygon'
                },
                {
                  type: 'multi-line'
                },
                {
                  type: 'multi-polygon'
                }
              ],
              fit: true
            },
            datasource: 'geospe-cifi-cdat-acd2-51ccec998307'
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'vega',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'vega',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: {
              baseSpec: vegaExampleSpec,
              placeData: ['data', 0, 'values']
            },
            datasource: '15061554-298f-4f56-8cd2-52ccec998307'
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'template',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'template',
            layout: { x: 1, y: 1, height: 6, width: 12 },
            options: {
              html: `<h1>Stationnement</h1>

                   <div style="display:flex">
                      <div style="flex: 50%;background-color: red">A</div>
                      <div style="flex: 50%;background-color: green">B</div>
                     </div>

                    <svg width="100" height="100">
                      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
                    </svg>

                    <div>
                    <img width="30px" src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Parking_icon.svg">
                      {{rs['8c2833a9-668d-49d0-a7e9-e67b4d7afa06'][0].attributes.an_nais}}
                    </div>`,
              css: 'h1 { color: blue }'
            },
            datasource: 'aze'
          },
          {
            type: 'template',
            layout: { x: 1, y: 7, height: 6, width: 12 },
            options: {
              html: `<h1>Stationnement</h1>

                   <div style="display:flex">
                      <div style="flex: 50%;background-color: red">A</div>
                      <div style="flex: 50%;background-color: green">B</div>
                     </div>

                    <svg width="100" height="100">
                      <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
                    </svg>

                    <div>
                    <img width="30px" src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Parking_icon.svg">
                      {{rs['8c2833a9-668d-49d0-a7e9-e67b4d7afa06'][0].attributes.an_nais}}
                    </div>`,
              css: 'h1, h2 { color: green }'
            },
            datasource: 'aze'
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'tile',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'tile',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: {},
            datasource: '39061554-298f-4f56-8cd2-51ccec998307'
          }
        ]
      } as DashboardManifest
    }
  },
  /* These routes are fine */
  {
    path: 'search',
    data: {
      access: {
        module: 'dashboard',
        page: 'dashboard'
      }
    },
    canActivate: [PRY_ACCESS_GUARD],
    children: [
      {
        path: '',
        component: SearchContainerComponent,
        data: {
          manifest: {
            widgets: []
          } as DashboardManifest
        }
      },
      {
        path: '',
        component: PrySearchToolsComponent,
        outlet: 'panel'
      }
    ]
  },
  {
    path: 'catalog',
    children: [
      {
        path: '',
        component: SearchContainerComponent,
        data: { manifest: { widgets: [] } as DashboardManifest }
      },
      {
        path: '',
        component: PryRestitutionListComponent,
        outlet: 'panel'
      }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('@provoly/dashboard/admin').then((m) => m.PryAdminModule)
  },
  {
    path: 'supervision',
    loadChildren: () => import('@provoly/dashboard/supervision').then((m) => m.PrySupervisionModule)
  },
  {
    path: 'presentation',
    canActivate: [PRY_ACCESS_GUARD],
    children: [
      {
        path: '',
        component: PryPresentationComponent
      }
    ]
  },
  {
    path: 'restitution',
    canActivate: [PRY_ACCESS_GUARD],
    children: [
      {
        path: '',
        component: PryRestitutionCatalogComponent
      }
    ]
  },
  {
    path: 'import',
    component: PryImportComponent
  },
  {
    path: 'editor',
    component: PryPipelineListComponent
  },
  {
    path: 'dataset',
    canActivate: [PRY_ACCESS_GUARD],
    children: [
      {
        path: '',
        component: PryDatasetComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
