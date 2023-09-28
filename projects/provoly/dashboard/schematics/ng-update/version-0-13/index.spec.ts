import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import path from 'path';

const schematicName = 'ng-update';
describe(schematicName, () => {
  const runner = new SchematicTestRunner('schematics', path.join(__dirname, '../../migration.json'));
  let tree: UnitTestTree;

  beforeEach(async () => {
    tree = await runner.runExternalSchematic(
      '@schematics/angular',
      'ng-new',
      { name: 'test-project', version: '0.0.0', directory: '.' },
      new UnitTestTree(Tree.empty())
    );
  });

  it(`should remove click option`, async () => {
    tree.create(
      '/app-routing.module.ts',
      `const routes: Routes = [
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
              attributions: true,
              tooltipMode: TooltipMode.CLICK,
              tooltipMode: 'click',
              layers: [
                {
                  type: 'marker',
                  attribute: 'location',
                  classes: []
                },
                {
                  type: 'marker',
                  attribute: 'location-auto',
                  classes: []
                },
                {
                  active: true,
                  type: 'heatmap',
                  intensityAttribute: 'temperature_en_degre_c',
                  intensityAsc: true,
                  classes: ['17b90da3-f448-4cc3-bfd8-74c8b8481590']
                },
                {
                  active: true,
                  type: 'bubble',
                  classes: ['06406e7e-37cd-41ce-b5fc-36d233e5ae5c'],
                  intensityAttribute: 'latitude',
                  intensityAsc: true,
                  opacity: 50
                },
                {
                  type: 'relation',
                  active: false
                },
                {
                  type: 'geoserver',
                  key: 'fntp:submersion',
                  opacity: 50
                }
              ],
              fit: true
            },
            datasource: ['29061554-298f-4f56-8cd2-51ccec998303', 's6406e7e-37cd-41ce-b5fc-36d233e6ae5c']
          }
        ]
      } as DashboardManifest
    }
  }
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
  }
];
`
    );

    await runner.runSchematic('migration-v0.13', {}, tree);
    const actual = tree.readContent('/app-routing.module.ts');
    expect(actual).not.toMatch(/tooltipMode\s*:\s*'hover'/);
    expect(actual).not.toMatch(/tooltipMode\s*:\s*'TooltipMode.HOVER/);
    expect(actual).toMatch(/tooltipMode\s*:\s*'click'/);
    expect(actual).toMatch(/tooltipMode\s*:\s*TooltipMode.CLICK/);
  });

  it(`should change type`, async () => {
    tree.create('/some-app.component.ts', `const datasetsMeta : DatasetMetadata[] = [];`);

    await runner.runSchematic('migration-v0.13', {}, tree);
    const actual = tree.readContent('/some-app.component.ts');
    expect(actual).not.toMatch(/DatasetMetadata/);
    expect(actual).toMatch(/MetadataValue/);
  });

  it(`should remove obsolete dependencies`, async () => {
    if (tree.exists('/package.json')) {
      await runner.runSchematic('migration-v0.13', {}, tree);
      const actual = tree.readContent('/package.json');
      expect(actual).not.toMatch(/ol-layerswitcher/);
      expect(actual).not.toMatch(/geojson-to-kml/);
      expect(actual).not.toMatch(/jszip/);
      expect(actual).not.toMatch(/shpjs/);
      expect(actual).not.toMatch(/@types\/shpjs/);
    }
  });
});
