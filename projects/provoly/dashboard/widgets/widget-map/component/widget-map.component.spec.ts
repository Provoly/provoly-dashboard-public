import { Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA, Injector, NO_ERRORS_SCHEMA, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ClassSelectors,
  ConfigSelectors,
  DashboardSelectors,
  DataSourceSelectors,
  FieldSelectors,
  LayerGroup,
  MapWidgetLayerOptions,
  MapWidgetOptions,
  MapWMSLayerLayerOptions,
  PryDatasetType,
  PryI18nService,
  PrySnackbarService,
  SymbolService,
  TooltipFactoryService,
  TooltipMode,
  TranslateIdPipe,
  WidgetManifest,
  WidgetOptions,
  WmsService
} from '@provoly/dashboard';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { hot } from 'jest-marbles';
import { of } from 'rxjs';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../mock/components/mock-pry-select.component';
import { MockPrySettingsComponent } from '../../../mock/components/mock-pry-settings.component';
import { MockPryToggleComponent } from '../../../mock/components/mock-pry-toggle.component';
import { MockPryWidgetHeaderComponent } from '../../../mock/components/mock-pry-widget-header.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockGeometryFieldsForPipe } from '../../../mock/pipe/mock-numeric-fields-for.pipe';
import { MockTranslateIdPipe } from '../../../mock/pipe/mock-translate-id.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { mapUtilsData } from '../utils/widget-map.utils.spec';

import { DEFAULT_LAYER_GROUP, WidgetMapComponent } from './widget-map.component';
import { WidgetMapUtils } from '@provoly/dashboard/widgets/widget-map';
import { layerGroups } from '../../../mock/data/layerGroups';
import SpyInstance = jest.SpyInstance;

describe('WidgetMapComponent', () => {
  let component: WidgetMapComponent;
  let fixture: ComponentFixture<WidgetMapComponent>;
  let store: MockStore;
  let snack: PrySnackbarService;
  let storeSpy: SpyInstance;

  let warn: any;

  beforeAll(() => {
    warn = console.warn;
    console.warn = () => {};
  });

  afterAll(() => {
    console.warn = warn;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        WidgetMapComponent,
        MockTranslateIdPipe,
        MockTranslatePipe,
        MockGeometryFieldsForPipe,
        MockPrySelectComponent,
        MockPryIconComponent,
        MockPryToggleComponent,
        MockPrySettingsComponent,
        MockPryWidgetHeaderComponent,
        MockI18nPipe,
        MockNgModelDirective
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.resultSets,
              value: { rs: mapUtilsData.rs }
            },
            {
              selector: DataSourceSelectors.datasets,
              value: [
                {
                  id: 'rs',
                  name: 'resultset',
                  oClass: '',
                  type: PryDatasetType.CLOSED,
                  metadata: []
                }
              ]
            },
            {
              selector: FieldSelectors.fields,
              value: [...mapUtilsData.fields, { id: 'lat-string', type: 'string' }]
            },
            {
              selector: ClassSelectors.classes,
              value: mapUtilsData.classes
            },
            {
              selector: DashboardSelectors.widgetManifest(0),
              value: {
                options: {
                  style: 'a-style',
                  layers: [
                    { type: 'heatmap', group: 'test-group' },
                    { type: 'marker' },
                    { type: 'point' },
                    { type: 'polygon' }
                  ],
                  tooltipMode: TooltipMode.CLICK
                } as MapWidgetOptions,
                resultSet: 'rs'
              }
            },
            {
              selector: ConfigSelectors.mapStyles,
              value: [
                { identifier: 'style1', label: 'style1' },
                { identifier: 'style2', label: 'style2' }
              ]
            },
            {
              selector: DataSourceSelectors.getDataSources,
              value: [
                {
                  id: 'rs',
                  name: 'resultset',
                  oClass: 'geoClass',
                  type: PryDatasetType.CLOSED,
                  metadata: [],
                  sourceType: 'dataset'
                },
                {
                  id: 'geo',
                  name: 'resultsetGeo',
                  oClass: 'geoClass',
                  type: PryDatasetType.CLOSED,
                  sourceType: 'dataset',
                  metadata: [
                    {
                      metadataDef: {
                        id: '9d9aba2c-fc3a-44d7-a508-287ad2d8cbb0',
                        name: '_geoNamespace',
                        type: 'string'
                      },
                      value: 'geoNamespace'
                    },
                    {
                      metadataDef: {
                        id: '7ce12610-e031-403c-a6e0-b8147979f657',
                        name: '_geoKey',
                        type: 'string'
                      },
                      value: 'geoKey'
                    },
                    {
                      metadataDef: {
                        id: '7ce12610-e031-403c-a6e0-b8147979f657',
                        name: '_geoOpacity',
                        type: 'number'
                      },
                      value: '50'
                    }
                  ]
                }
              ]
            },
            {
              selector: DashboardSelectors.capabilities,
              value: []
            },
            {
              selector: ConfigSelectors.geoServerUrl,
              value: 'http://geoserver.url'
            },
            {
              selector: DashboardSelectors.layerGroups,
              value: [...layerGroups] as LayerGroup[]
            }
          ]
        }),
        { provide: TranslateIdPipe, useValue: { transform: () => undefined } },
        { provide: WmsService, useValue: { getCapabilities: () => of(null) } },
        { provide: PrySnackbarService, useValue: { open: jest.fn() } },
        {
          provide: Overlay,
          useValue: { create: jest.fn(() => ({ attach: jest.fn(() => ({ instance: {} })) })) }
        },
        {
          provide: SymbolService,
          useValue: {}
        },
        { provide: PryI18nService, useValue: { instant: (key: string) => key } },
        {
          provide: TooltipFactoryService,
          useValue: {
            generateTooltip: (type: string, parentInjector: Injector, container: ViewContainerRef) => of(null)
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    snack = TestBed.inject(PrySnackbarService);
  });

  beforeEach(() => {
    storeSpy = jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(WidgetMapComponent);
    component = fixture.componentInstance;
    component._manifest$ = of({
      type: 'map',
      layout: { x: 1, y: 1, width: 10, height: 10 },
      options: {
        style: 'a-style',
        layers: [{ type: 'heatmap', group: 'test-group' }, { type: 'marker' }, { type: 'point' }, { type: 'polygon' }],
        tooltipMode: TooltipMode.CLICK
      } as MapWidgetOptions,
      datasource: 'rs'
    });
    component.widgetIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate auto options for heatmap', () => {
    component._manifest$ = of({
      options: {
        style: 'a-style',
        layers: [{ type: 'heatmap' }],
        tooltipMode: TooltipMode.CLICK
      } as MapWidgetOptions,
      datasource: 'rs'
    } as WidgetManifest);
    component.widgetIndex = 0;
    fixture.detectChanges();
    expect(component.options$).toBeObservable(
      hot('a', {
        a: {
          style: 'style1',
          layers: [
            {
              type: 'heatmap',
              attribute: 'loc',
              intensityAttribute: 'intensity',
              intensityAsc: true,
              title: '@pry.widget.map.layerType.heatmap',
              order: 0
            }
          ],
          tooltipMode: TooltipMode.CLICK
        }
      })
    );

    expect(component.options$).toSatisfyOnFlush(() => {
      expect(component.optionsCopy).toEqual({
        style: 'style1',
        layers: [
          {
            type: 'heatmap',
            attribute: 'loc',
            group: 'DEFAULT',
            intensityAttribute: 'intensity',
            intensityAsc: true,
            title: '@pry.widget.map.layerType.heatmap',
            order: 0
          }
        ],
        tooltipMode: TooltipMode.CLICK
      });
    });
  });

  it('should calculate auto options for markermap', () => {
    component._manifest$ = of({
      options: { style: 'a-style', layers: [{ type: 'marker' }] } as MapWidgetOptions,
      datasource: 'rs'
    } as WidgetManifest);
    component.widgetIndex = 0;
    fixture.detectChanges();
    expect(component.options$).toBeObservable(
      hot('a', {
        a: {
          style: 'style1',
          layers: [
            {
              type: 'marker',
              attribute: 'loc',
              title: '@pry.widget.map.layerType.marker',
              order: 0
            }
          ],
          tooltipMode: TooltipMode.CLICK
        }
      })
    );

    expect(component.options$).toSatisfyOnFlush(() => {
      expect(component.optionsCopy).toEqual({
        style: 'style1',
        layers: [
          {
            type: 'marker',
            attribute: 'loc',
            group: DEFAULT_LAYER_GROUP,
            title: '@pry.widget.map.layerType.marker',
            order: 0
          }
        ],
        tooltipMode: TooltipMode.CLICK
      });
    });
  });

  it('should calculate auto options for bubblemap', () => {
    component._manifest$ = of({
      options: { style: 'a-style', layers: [{ type: 'bubble' }] } as MapWidgetOptions,
      datasource: 'rs'
    } as WidgetManifest);
    component.widgetIndex = 0;
    fixture.detectChanges();
    expect(component.options$).toBeObservable(
      hot('a', {
        a: {
          style: 'style1',
          layers: [
            {
              type: 'bubble',
              attribute: 'loc',
              intensityAttribute: 'intensity',
              intensityAsc: true,
              title: '@pry.widget.map.layerType.bubble',
              order: 0
            }
          ],
          tooltipMode: TooltipMode.CLICK
        }
      })
    );

    expect(component.options$).toSatisfyOnFlush(() => {
      expect(component.optionsCopy).toEqual({
        style: 'style1',
        layers: [
          {
            type: 'bubble',
            attribute: 'loc',
            group: DEFAULT_LAYER_GROUP,
            intensityAttribute: 'intensity',
            intensityAsc: true,
            title: '@pry.widget.map.layerType.bubble',
            order: 0
          }
        ],
        tooltipMode: TooltipMode.CLICK
      });
    });
  });

  it('should allow manifest emission', () => {
    const spyEmit = jest.spyOn(component.manifestModified, 'emit').mockReturnValue();
    component._manifest$ = of({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: { layers: [{ type: 'heatmap' }] } as MapWidgetOptions,
      datasource: 'rs',
      type: 'map'
    } as WidgetManifest);
    component.widgetIndex = 0;
    component.emitManifest();
    expect(component.manifestModified.emit).toHaveBeenCalledWith({
      widgetIndex: 0,
      manifest: {
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: {
          style: 'style1',
          tooltipMode: TooltipMode.CLICK,
          layers: [
            {
              intensityAsc: true,
              intensityAttribute: 'intensity',
              attribute: 'loc',
              group: DEFAULT_LAYER_GROUP,
              type: 'heatmap',
              title: '@pry.widget.map.layerType.heatmap',
              order: 0
            }
          ]
        } as WidgetOptions,
        datasource: 'rs',
        type: 'map'
      }
    });
  });

  it('should allow adding a layer', () => {
    expect(component.optionsCopy.layers?.length).toEqual(4);
    component.addLayer(layerGroups[1]);
    expect(component.optionsCopy.layers?.length).toEqual(5);
    component.addLayer(layerGroups[0]);
    expect(component.optionsCopy.layers?.length).toEqual(6);
  });

  it('should allow changing a layer type', () => {
    component.changeLayerType('bubblemap', 0);
    expect(component.optionsCopy.layers?.length).toEqual(4);
    expect((component.optionsCopy.layers ?? [])[0].type).toEqual('bubblemap');
  });

  it('should allow changing fit option', () => {
    component.changeFit(true, component.optionsCopy.layers![0]);
    expect(component.optionsCopy.layers![0].fit).toEqual(true);
  });

  it('should allow changing map style', () => {
    component.changeStyle('new-style');
    expect(component.optionsCopy.style).toEqual('new-style');
  });

  it('should allow deleting a layer', () => {
    expect(component.optionsCopy.layers?.length).toEqual(4);
    component.deleteLayer(0, component.optionsCopy.layers![0], layerGroups[0]);
    expect(component.optionsCopy.layers?.length).toEqual(3);
  });

  it('should allow changing url', () => {
    const layer = { url: '' } as MapWMSLayerLayerOptions;
    component.changeUrl({ currentTarget: { value: 'http://url' } } as unknown as Event, layer);
    expect(layer.url).toEqual('http://url');
  });

  it('should provide fit operation', () => {
    try {
      component.fitMapForObjects();
    } catch (e) {
      fail('');
    }
  });

  afterEach(() => {
    // don't forget to reset the timers
    jest.useRealTimers();
  });

  it('should allow preconfiguration of layers', () => {
    jest.useFakeTimers();

    component.staticManifest = {
      options: {
        style: 'a-style',
        layers: [{ type: 'geoserver', opacity: 60, key: 'a' }]
      } as MapWidgetOptions,
      datasource: 'geo'
    } as WidgetManifest;

    const results = [] as MapWidgetOptions[];
    component.options$.subscribe((options) => results.push(options));

    fixture.detectChanges();

    jest.advanceTimersByTime(10_000);
    jest.runOnlyPendingTimers();

    expect(results[results.length - 1]).toEqual({
      layers: [
        {
          datasourceId: 'geo',
          key: 'geoNamespace:geoKey',
          name: 'resultsetGeo',
          namespace: 'geoNamespace',
          oClass: 'geoClass',
          opacity: 50,
          paramLayer: 'geoKey',
          paramTiled: true,
          type: 'geoserver',
          url: 'http://geoserver.url/geoNamespace/wms?SERVICE=WMS&VERSION=1.3.0',
          order: 0
        }
      ],
      style: 'style1',
      tooltipMode: 'click'
    });
  });

  it('should propose automatic configuration', () => {
    jest.useFakeTimers();

    component.staticManifest = {
      options: {
        style: 'a-style',
        layers: [],
        automaticLayers: true
      } as MapWidgetOptions,
      datasource: 'rs'
    } as WidgetManifest;

    const results = [] as MapWidgetOptions[];
    component.options$.subscribe((options) => results.push(options));

    fixture.detectChanges();

    jest.advanceTimersByTime(10_000);
    jest.runOnlyPendingTimers();

    expect(results[results.length - 1]).toEqual({
      layers: [
        {
          attribute: 'loc',
          classes: ['geoClass'],
          key: 'rs',
          oClass: 'geoClass',
          subType: 'Point',
          title: 'resultset - loc',
          type: 'auto',
          order: 0
        },
        {
          attribute: 'zone',
          classes: ['geoClass'],
          key: 'rs',
          oClass: 'geoClass',
          subType: 'MultiPolygon',
          title: 'resultset - zone',
          type: 'auto',
          order: 1
        }
      ],
      style: 'style1',
      tooltipMode: 'click',
      automaticLayers: true
    });
  });

  it('automatic configuration should respect order', () => {
    jest.useFakeTimers();

    component.staticManifest = {
      options: {
        style: 'a-style',
        layers: [{ type: 'wms', background: true }],
        automaticLayers: true
      } as MapWidgetOptions,
      datasource: 'rs'
    } as WidgetManifest;

    const results = [] as MapWidgetOptions[];
    component.options$.subscribe((options) => results.push(options));

    fixture.detectChanges();

    jest.advanceTimersByTime(10_000);
    jest.runOnlyPendingTimers();

    expect(results[results.length - 1]).toEqual({
      layers: [
        {
          attribute: 'loc',
          classes: ['geoClass'],
          key: 'rs',
          oClass: 'geoClass',
          subType: 'Point',
          title: 'resultset - loc',
          type: 'auto',
          order: 0
        },
        {
          attribute: 'zone',
          classes: ['geoClass'],
          key: 'rs',
          oClass: 'geoClass',
          subType: 'MultiPolygon',
          title: 'resultset - zone',
          type: 'auto',
          order: 4999.5
        },
        {
          type: 'wms',
          background: true,
          order: WidgetMapUtils.BACKGROUND_ORDER
        }
      ],
      style: 'style1',
      tooltipMode: 'click',
      automaticLayers: true
    });
  });

  it('automatic order assignment give correct orders if not present', () => {
    jest.useFakeTimers();

    component.staticManifest = {
      options: {
        style: 'a-style',
        layers: [
          { type: 'wms', background: true, paramLayer: '1' },
          { type: 'wms', paramLayer: '2', order: 3 },
          { type: 'wms', paramLayer: '3' },
          { type: 'wms', paramLayer: '4', order: 8 },
          { type: 'wms', paramLayer: '5' }
        ]
      } as MapWidgetOptions,
      datasource: 'rs'
    } as WidgetManifest;

    const results = [] as MapWidgetOptions[];
    component.options$.subscribe((options) => results.push(options));

    fixture.detectChanges();

    jest.advanceTimersByTime(10_000);
    jest.runOnlyPendingTimers();

    expect(results[results.length - 1]).toEqual({
      layers: [
        { type: 'wms', paramLayer: '2', order: 3 },
        { type: 'wms', paramLayer: '3', order: 5.5 },
        { type: 'wms', paramLayer: '4', order: 8 },
        { type: 'wms', paramLayer: '5', order: 5003.5 },
        { type: 'wms', background: true, paramLayer: '1', order: 9999 }
      ],
      style: 'style1',
      tooltipMode: 'click'
    });
  });

  it('automatic order assignment give correct orders nothing present', () => {
    jest.useFakeTimers();

    component.staticManifest = {
      options: {
        style: 'a-style',
        layers: [{ type: 'heatmap' }, { type: 'marker' }, { type: 'point' }, { type: 'polygon' }]
      } as MapWidgetOptions,
      datasource: 'rsadzazd'
    } as WidgetManifest;

    const results = [] as MapWidgetOptions[];
    component.options$.subscribe((options) => results.push(options));

    fixture.detectChanges();

    jest.advanceTimersByTime(10_000);
    jest.runOnlyPendingTimers();

    expect(results[results.length - 1]).toEqual({
      layers: [
        { type: 'heatmap', attribute: 'loc', order: 0, title: '@pry.widget.map.layerType.heatmap' },
        { type: 'marker', attribute: 'loc', order: 1, title: '@pry.widget.map.layerType.marker' },
        { type: 'point', attribute: 'loc', order: 2, title: '@pry.widget.map.layerType.point' },
        { type: 'polygon', order: 3, title: '@pry.widget.map.layerType.polygon' }
      ],
      style: 'style1',
      tooltipMode: 'click'
    });
  });

  it('should support legacy fit but make it disappear', () => {
    jest.useFakeTimers();

    component.staticManifest = {
      options: {
        style: 'a-style',
        layers: [{ type: 'heatmap' }, { type: 'marker' }, { type: 'point' }, { type: 'polygon' }],
        fit: true
      } as MapWidgetOptions,
      datasource: 'rsadzazd'
    } as WidgetManifest;

    const results = [] as MapWidgetOptions[];
    component.options$.subscribe((options) => results.push(options));

    fixture.detectChanges();

    jest.advanceTimersByTime(10_000);
    jest.runOnlyPendingTimers();

    expect(results[results.length - 1]).toEqual({
      layers: [
        { type: 'heatmap', attribute: 'loc', order: 0, title: '@pry.widget.map.layerType.heatmap', fit: true },
        { type: 'marker', attribute: 'loc', order: 1, title: '@pry.widget.map.layerType.marker', fit: true },
        { type: 'point', attribute: 'loc', order: 2, title: '@pry.widget.map.layerType.point', fit: true },
        { type: 'polygon', order: 3, title: '@pry.widget.map.layerType.polygon', fit: true }
      ],
      style: 'style1',
      tooltipMode: 'click'
    });
  });

  describe('layer groups', () => {
    it('should initialise default group in the store on component init if there isnt one with all layers that dont have a group', () => {
      // expect(storeSpy).toHaveBeenCalledWith(DashboardActions.initDefaultLayerGroup({ layers: [] }));
    });
    it('should assign default group to all layers that dont have a group on init', () => {
      expect(component.optionsCopy.layers?.map((layer) => layer.group)).toEqual([
        'test-group',
        DEFAULT_LAYER_GROUP,
        DEFAULT_LAYER_GROUP,
        DEFAULT_LAYER_GROUP
      ]);
    });
    describe('moving layers by drag and drop', () => {
      it('should move layer to the start of layer array and reassign orders (orders sorted by group order in store)', () => {
        component.optionsCopy.layers = [
          { title: '1', type: 'heatmap', order: 1, group: 'blue' },
          { title: '2', type: 'heatmap', order: 2, group: 'blue' },
          { title: '3', type: 'heatmap', order: 3, group: 'green' },
          { title: '4', type: 'heatmap', order: 4, group: 'blue' }
        ] as MapWidgetLayerOptions[];

        const movedLayer = component.optionsCopy.layers[3];
        const group = { name: 'blue', singleLayer: false, visibleLayers: [] } as LayerGroup;

        component.moveLayerInOptions(0, movedLayer, group);

        expect(component.optionsCopy.layers).toEqual([
          { title: '4', type: 'heatmap', order: 2, group: 'blue' },
          { title: '1', type: 'heatmap', order: 3, group: 'blue' },
          { title: '2', type: 'heatmap', order: 4, group: 'blue' },
          { title: '3', type: 'heatmap', order: 1, group: 'green' }
        ]);
      });
      it('should move layer to the end of layer array and reassign orders (orders sorted by group order in store)', () => {
        component.optionsCopy.layers = [
          { title: '1', type: 'heatmap', order: 1, group: 'blue' },
          { title: '2', type: 'heatmap', order: 2, group: 'red' },
          { title: '3', type: 'heatmap', order: 3, group: 'blue' },
          { title: '4', type: 'heatmap', order: 4, group: 'red' },
          { title: '5', type: 'heatmap', order: 5, group: 'blue' }
        ] as MapWidgetLayerOptions[];

        const movedLayer = component.optionsCopy.layers[0];
        const group = { name: 'blue', singleLayer: false, visibleLayers: [] } as LayerGroup;

        component.moveLayerInOptions(2, movedLayer, group);

        expect(component.optionsCopy.layers).toEqual([
          { title: '2', type: 'heatmap', order: 1, group: 'red' },
          { title: '3', type: 'heatmap', order: 3, group: 'blue' },
          { title: '4', type: 'heatmap', order: 2, group: 'red' },
          { title: '5', type: 'heatmap', order: 4, group: 'blue' },
          { title: '1', type: 'heatmap', order: 5, group: 'blue' }
        ]);
      });
      it('should move layer down and reassign orders (orders sorted by group order in store)', () => {
        component.optionsCopy.layers = [
          { title: '1', type: 'heatmap', order: 0, group: 'green' },
          { title: '2', type: 'heatmap', order: 1, group: 'blue' },
          { title: '3', type: 'heatmap', order: 3, group: 'red' },
          { title: '4', type: 'heatmap', order: 5, group: 'green' },
          { title: '5', type: 'heatmap', order: 10, group: 'green' }
        ] as MapWidgetLayerOptions[];

        const movedLayer = component.optionsCopy.layers[0];
        const group = { name: 'green', singleLayer: false, visibleLayers: [] } as LayerGroup;

        component.moveLayerInOptions(1, movedLayer, group);

        expect(component.optionsCopy.layers).toEqual([
          { title: '2', type: 'heatmap', order: 5, group: 'blue' },
          { title: '3', type: 'heatmap', order: 1, group: 'red' },
          { title: '4', type: 'heatmap', order: 2, group: 'green' },
          { title: '1', type: 'heatmap', order: 3, group: 'green' },
          { title: '5', type: 'heatmap', order: 4, group: 'green' }
        ]);
      });
    });
    it('should move layer up and reassign orders (orders sorted by group order in store)', () => {
      component.optionsCopy.layers = [
        { title: '1', type: 'heatmap', order: 1, group: 'red' },
        { title: '2', type: 'heatmap', order: 2, group: 'green' },
        { title: '3', type: 'heatmap', order: 3, group: 'red' },
        { title: '4', type: 'heatmap', order: 4, group: 'green' },
        { title: '5', type: 'heatmap', order: 5, group: 'blue' }
      ] as MapWidgetLayerOptions[];

      const movedLayer = component.optionsCopy.layers[3];
      const group = { name: 'green', singleLayer: false, visibleLayers: [] } as LayerGroup;

      component.moveLayerBetweenGroups(movedLayer, group.name);
      component.moveLayerInOptions(0, movedLayer, group);

      expect(component.optionsCopy.layers).toEqual([
        { title: '1', type: 'heatmap', order: 1, group: 'red' },
        { title: '4', type: 'heatmap', order: 3, group: 'green' },
        { title: '2', type: 'heatmap', order: 4, group: 'green' },
        { title: '3', type: 'heatmap', order: 2, group: 'red' },
        { title: '5', type: 'heatmap', order: 5, group: 'blue' }
      ]);
    });
  });
  describe('updateLayerGroup', () => {
    it('if the group name is being changed, update it also on the layers', () => {
      const group = { name: 'group3', singleLayer: false, visibleLayers: [] } as LayerGroup;

      component.addLayer(group);
      component.updateLayerGroup('group3', 'newName');

      expect(component.optionsCopy.layers?.find((layer) => layer.group === group.name)).toEqual(undefined);
      expect(component.optionsCopy.layers?.map((layer) => layer.group).filter((group) => group === 'newName')).toEqual([
        'newName'
      ]);
    });
  });
});
