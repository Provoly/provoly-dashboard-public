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
  GeocodingService,
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
  WidgetOptions
} from '@provoly/dashboard';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { MockPryTooltipDirective } from '@provoly/dashboard/mock/directive/mock-pry-tooltip.directive';
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

import { WidgetMapComponent } from './widget-map.component';

describe('WidgetMapComponent', () => {
  let component: WidgetMapComponent;
  let fixture: ComponentFixture<WidgetMapComponent>;
  let store: MockStore;
  let snack: PrySnackbarService;

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
        MockPryTooltipDirective,
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
                  layers: [{ type: 'heatmap' }, { type: 'marker' }, { type: 'point' }, { type: 'polygon' }],
                  fit: true,
                  tooltipMode: TooltipMode.HOVER
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
              value: []
            }
          ]
        }),
        { provide: TranslateIdPipe, useValue: { transform: () => undefined } },
        { provide: GeocodingService, useValue: { search: () => undefined } },
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
    fixture = TestBed.createComponent(WidgetMapComponent);
    component = fixture.componentInstance;
    component._manifest$ = of({
      type: 'map',
      layout: { x: 1, y: 1, width: 10, height: 10 },
      options: {
        style: 'a-style',
        layers: [{ type: 'heatmap' }, { type: 'marker' }, { type: 'point' }, { type: 'polygon' }],
        fit: true,
        tooltipMode: TooltipMode.HOVER
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
        fit: true,
        tooltipMode: TooltipMode.HOVER
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
              title: '1 - @pry.widget.map.layerType.heatmap'
            }
          ],
          fit: true,
          relations: true,
          tooltipMode: TooltipMode.HOVER
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
            intensityAttribute: 'intensity',
            intensityAsc: true,
            title: '1 - @pry.widget.map.layerType.heatmap'
          }
        ],
        fit: true,
        relations: true,
        tooltipMode: TooltipMode.HOVER
      });
    });
  });

  it('should calculate auto options for markermap', () => {
    component._manifest$ = of({
      options: { style: 'a-style', layers: [{ type: 'marker' }], fit: true } as MapWidgetOptions,
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
              title: '1 - @pry.widget.map.layerType.marker'
            }
          ],
          fit: true,
          relations: true,
          tooltipMode: TooltipMode.HOVER
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
            title: '1 - @pry.widget.map.layerType.marker'
          }
        ],
        fit: true,
        relations: true,
        tooltipMode: TooltipMode.HOVER
      });
    });
  });

  it('should calculate auto options for bubblemap', () => {
    component._manifest$ = of({
      options: { style: 'a-style', layers: [{ type: 'bubble' }], fit: true } as MapWidgetOptions,
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
              title: '1 - @pry.widget.map.layerType.bubble'
            }
          ],
          fit: true,
          relations: true,
          tooltipMode: TooltipMode.HOVER
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
            intensityAttribute: 'intensity',
            intensityAsc: true,
            title: '1 - @pry.widget.map.layerType.bubble'
          }
        ],
        fit: true,
        relations: true,
        tooltipMode: TooltipMode.HOVER
      });
    });
  });

  it('should allow manifest emission', () => {
    const spyEmit = jest.spyOn(component.manifestModified, 'emit').mockReturnValue();
    component._manifest$ = of({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: { layers: [{ type: 'heatmap' }], fit: true } as MapWidgetOptions,
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
          fit: true,
          tooltipMode: TooltipMode.HOVER,
          layers: [
            {
              intensityAsc: true,
              intensityAttribute: 'intensity',
              attribute: 'loc',
              type: 'heatmap',
              title: '1 - @pry.widget.map.layerType.heatmap'
            }
          ],
          relations: true
        } as WidgetOptions,
        datasource: 'rs',
        type: 'map'
      }
    });
  });

  it('should allow adding a layer', () => {
    expect(component.optionsCopy.layers?.length).toEqual(4);
    component.addLayer();
    expect(component.optionsCopy.layers?.length).toEqual(5);
    component.addLayer();
    expect(component.optionsCopy.layers?.length).toEqual(6);
  });

  it('should allow changing a layer type', () => {
    component.changeLayerType('bubblemap', 0);
    expect(component.optionsCopy.layers?.length).toEqual(4);
    expect((component.optionsCopy.layers ?? [])[0].type).toEqual('bubblemap');
  });

  it('should allow changing fit option', () => {
    component.changeFit(true);
    expect(component.optionsCopy.fit).toEqual(true);
  });

  it('should allow changing map style', () => {
    component.changeStyle('new-style');
    expect(component.optionsCopy.style).toEqual('new-style');
  });

  it('should allow deleting a layer', () => {
    expect(component.optionsCopy.layers?.length).toEqual(4);
    component.deleteLayer(0);
    expect(component.optionsCopy.layers?.length).toEqual(3);
  });

  it('should allow switching layers', () => {
    expect(component.optionsCopy.layers?.length).toEqual(4);
    component.invertLayers(0, 2);
    expect(component.optionsCopy.layers?.length).toEqual(4);
    expect(component.optionsCopy.layers![0].type).toEqual('point');
  });

  it('should allow changing url', () => {
    const layer = { url: '' } as MapWMSLayerLayerOptions;
    component.changeUrl({ currentTarget: { value: 'http://url' } } as unknown as Event, layer);
    expect(layer.url).toEqual('http://url');
  });

  it('should allow importing', () => {
    const snackSpy = jest.spyOn(snack, 'open').mockReturnValue(null);
    expect(component.optionsCopy.layers?.length).toEqual(4);
    component.import({ target: { files: [new File([new ArrayBuffer(1)], 'file.jpg')] } } as unknown as Event);
    expect(snackSpy).toHaveBeenCalledWith({ message: '@pry.widget.map.importStart', type: 'info' });
  });

  it('should provide fit operation', () => {
    try {
      component.fitMapForObjects({ style: 'none' }, []);
    } catch (e) {
      fail('');
    }
  });
});
