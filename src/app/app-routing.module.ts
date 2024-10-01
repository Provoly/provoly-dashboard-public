import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardManifest, Filter, PRY_ACCESS_GUARD, TooltipMode } from '@provoly/dashboard';
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
import { PryTextEditorComponent } from '@provoly/dashboard/components/text-editor';
import { PryImportFormComponent, PryImportListComponent } from '@provoly/dashboard/import';

const routes: Routes = [
  /* In a real app, do not make routes like these ones */
  {
    path: '',
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
              tooltipMode: TooltipMode.CLICK,
              layers: [
                {
                  type: 'marker',
                  fit: true
                },
                {
                  type: 'heatmap',
                  classes: ['0e745c78-4a74-4bfd-9789-06ec93f7d364']
                },
                {
                  type: 'bubble',
                  classes: ['06406e7e-37cd-41ce-b5fc-36d233e5ae5c'],
                  opacity: 50
                },
                {
                  type: 'wms',
                  opacity: 40,
                  paramLayer: 'ac:243300316_072022',
                  url: 'https://geo.demo.provoly.net/geoserver/alter-carbon/wms',
                  paramTiled: true,
                  fit: true
                }
              ]
            },
            datasource: ['s6406e7e-37cd-41ce-b5fc-36d233e6ae5c', '09061554-298f-4f56-8cd2-51ccec998307']
          }
        ]
      } as DashboardManifest,
      filters: [
        {
          id: 'e766ea71-71ca-45e8-b6c8-6494c4b0c5a0',
          name: 'Statut',
          type: 'list',
          attributes: [
            {
              id: 'f629ef8a-8773-4e3b-914b-6ab838d255bb',
              technicalName: 'statut',
              label: 'statut / CKDo:EquipementsPublics / Equipements publics',
              datasource: 's6406e7e-37cd-41ce-b5fc-36d233e6ae5c'
            }
          ],
          operator: 'EQUALS',
          possibleValues: 'PUBLIC,PRIVE,PARA_PUBLIC',
          value: 'PRIVE'
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
            datasource: ['17b90da3-f448-4cc3-bfd8-74c8b8481590']
          }
        ]
      } as DashboardManifest,
      filters: [
        {
          id: '236c1cce-9d57-4d52-84e5-0b86d6765296',
          name: 'Date',
          type: 'date',
          attributes: [
            {
              id: 'd5d4cda4-7ff3-4f19-ab69-7c95745888cf',
              technicalName: 'heure_utc',
              label: 'Date',
              datasource: '17b90da3-f448-4cc3-bfd8-74c8b8481590'
            }
          ],
          operator: 'EQUALS',
          value: '2024-12-31'
        },
        {
          id: '37f0b018-3c7f-45d6-955f-5a814fb40c1c',
          name: 'Plage date',
          type: 'date',
          attributes: [
            {
              id: 'd5d4cda4-7ff3-4f19-ab69-7c95745888cf',
              technicalName: 'heure_utc',
              label: 'Date',
              datasource: '17b90da3-f448-4cc3-bfd8-74c8b8481590'
            }
          ],
          operator: 'INSIDE',
          hasDateRange: true,
          value: '2024-01-01,2024-12-31'
        }
      ] as Filter[]
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
            datasource: 'meteo-cifi-cdat-acd2-51ccec998307'
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
    path: 'detail',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'detail',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: { layout: 'simple' },
            datasource: '17b90da3-f448-4cc3-bfd8-74c8b8481590'
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
              layers: [],
              fit: true,
              automaticLayers: true
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
    path: 'analytic',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'analytic',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: {
              primaryProp: 'horizon',
              secondaryProp: 'risque',
              verticalProp: 'alea',
              valueProp: 'valeur'
            },
            datasource: 'dataset-dr2'
          }
        ]
      } as DashboardManifest
    }
  },
  {
    path: 'analytic-color',
    component: DashboardContainerComponent,
    data: {
      manifest: {
        widgets: [
          {
            type: 'analytic',
            layout: { x: 1, y: 1, height: 12, width: 12 },
            options: {
              primaryProp: 'horizon',
              verticalProp: 'alea',
              valueProp: 'encours',
              colorConfig: {
                prop: 'score_global',
                colors: ['#C9F3E9', '#FFF4ED', '#FFB0A5', '#FF7866', '#FF4127']
              },
              format: {
                suffix: '€'
              }
            },
            datasource: 'dataset-dr2-with-color'
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
    path: 'import-form',
    component: PryImportFormComponent
  },
  {
    path: 'import-list',
    component: PryImportListComponent
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
    path: 'text-editor',
    canActivate: [PRY_ACCESS_GUARD],
    children: [
      {
        path: '',
        component: PryTextEditorComponent
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
