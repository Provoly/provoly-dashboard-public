import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  AggregationResult,
  ChartAggregatedWidgetOptions,
  ClassSelectors,
  DashboardSelectors,
  DataSourceSelectors,
  FieldSelectors,
  NamedQueryTypes,
  PryAggregationService,
  PryI18nService,
  WidgetManifest
} from '@provoly/dashboard';
import { WidgetAggregatedChartComponent } from '@provoly/dashboard/widgets/widget-aggregated-chart';
import { of } from 'rxjs';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPrySelectComponent } from '../../../mock/components/mock-pry-select.component';
import { MockPrySettingsComponent } from '../../../mock/components/mock-pry-settings.component';
import { MockPryWidgetHeaderComponent } from '../../../mock/components/mock-pry-widget-header.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

describe('WidgetAggregatedChartComponent', () => {
  let component: WidgetAggregatedChartComponent;
  let fixture: ComponentFixture<WidgetAggregatedChartComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        WidgetAggregatedChartComponent,
        MockPrySelectComponent,
        MockPrySettingsComponent,
        MockPryCheckboxComponent,
        MockTranslatePipe,
        MockPryWidgetHeaderComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PryI18nService, useValue: { instant: (key: string) => key } },
        {
          provide: PryAggregationService,
          useValue: {
            aggregate: () => of({ operation: 'none', values: [{ key: 'A', value: 'V' }] } as AggregationResult)
          }
        },
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.resultSets,
              value: {
                a: {
                  items: {
                    a: [
                      {
                        id: '5',
                        oClass: 'a',
                        attributes: {
                          '1': { value: 'value', type: 'VALUE', visible: true },
                          '2': { value: 'value2', type: 'VALUE', visible: true },
                          '3': { value: 4, type: 'VALUE', visible: true },
                          '4': { value: 19090290090, type: 'VALUE', visible: true }
                        }
                      }
                    ]
                  },
                  relations: []
                }
              }
            },
            {
              selector: FieldSelectors.fields,
              value: [
                { id: 'f1', name: 'field-name-1', type: 'string' },
                { id: 'f2', name: 'field-name-2', type: 'string' },
                { id: 'f3', name: 'field-name-3', type: 'integer' },
                { id: 'f4', name: 'field-name-4', type: 'instant' }
              ]
            },
            {
              selector: ClassSelectors.classes,
              value: [
                {
                  id: 'a',
                  attributes: [
                    { id: '1', field: 'f1', name: 'field-name-1' },
                    { id: '2', field: 'f2', name: 'field-name-2' },
                    { id: '3', field: 'f3', name: 'field-name-3' },
                    { id: '4', field: 'f4', name: 'field-name-4' }
                  ]
                }
              ]
            },
            {
              selector: DataSourceSelectors.getAllNamedQuery,
              value: [{ sourceType: 'namedQuery', id: '1', request: { type: NamedQueryTypes.MONO_CLASS, oClass: 'a' } }]
            }
          ]
        })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetAggregatedChartComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    component._widgetSize$.next({ width: 300, height: 300 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow emitting manifest', () => {
    const spyEmit = jest.spyOn(component.manifestModified, 'emit').mockReturnValue(undefined);
    DashboardSelectors.widgetManifest(0).setResult({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: {},
      type: 'placeholder'
    });
    component._manifest$ = of({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: {},
      type: 'placeholder'
    });
    component.widgetIndex = 0;
    component.emitManifest();
    expect(spyEmit).toHaveBeenCalledWith({
      widgetIndex: 0,
      manifest: {
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: {
          abscissa: { keep0: true },
          ordinate: { keep0: true },
          graph: { tooltip: true, type: 'bar-default', legend: false }
        },
        type: 'placeholder'
      }
    });
  });

  it('should allow display with limited options', (done) => {
    const manifest = {
      options: { abscissa: { attribute: '1' }, ordinate: { attribute: '2' } } as ChartAggregatedWidgetOptions,
      datasource: 'a'
    } as WidgetManifest;
    DashboardSelectors.widgetManifest(0).setResult(manifest);
    component.widgetIndex = 0;
    component._manifest$ = of(manifest);
    // @ts-ignore
    component._widgetSize$.next({ width: 300, height: 300 });
    component.vegaLiteSpec$.subscribe((spec) => {
      expect(spec).toEqual({
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        title: 'key / value',
        width: 'container',
        height: 240,
        padding: 10,
        autosize: { type: 'fit', contains: 'padding' },
        data: { values: [{ key: 'A', value: 'V' }] },
        layer: [
          {
            mark: { innerRadius: 30, line: false, point: false, type: 'bar' },
            encoding: {
              color: {
                field: undefined,
                legend: false,
                scale: undefined,
                title: '@pry.widget.chart.legendLabel',
                value: '#40b688'
              },
              theta: undefined,
              x: {
                axis: { grid: false, labelExpr: 'height < 300 ? truncate(datum.value, 10) : datum.value' },
                bin: false,
                field: 'key',
                scale: { zero: true },
                timeUnit: undefined,
                title: undefined,
                type: 'nominal'
              },
              xOffset: undefined,
              y: {
                axis: {},
                field: 'value',
                scale: { zero: false },
                stack: true,
                title: undefined,
                type: 'nominal'
              },
              tooltip: [
                { field: 'key', type: 'nominal', title: undefined },
                { field: 'value', type: 'nominal', title: undefined }
              ]
            }
          }
        ],
        config: {
          text: { font: 'Ubuntu, sans-serif' },
          style: {
            'guide-label': { font: 'Ubuntu, sans-serif' },
            'guide-title': { font: 'Ubuntu, sans-serif' },
            'group-title': { font: 'Ubuntu, sans-serif' },
            'group-subtitle': { font: 'Ubuntu, sans-serif' }
          }
        }
      });
      done();
    });
  });

  it('should allow to switch display to donut', (done) => {
    const manifest = {
      options: {
        abscissa: {
          keep0: true,
          attribute: '1'
        },
        ordinate: {
          keep0: true,
          attribute: '2'
        },
        graph: {
          legend: true,
          tooltip: true,
          type: 'arc-donut'
        }
      } as ChartAggregatedWidgetOptions,
      datasource: 'a'
    } as WidgetManifest;
    DashboardSelectors.widgetManifest(0).setResult(manifest);
    component._manifest$ = of(manifest);
    component.widgetIndex = 0;
    // @ts-ignore
    component._widgetSize$.next({ width: 300, height: 300 });
    component.vegaLiteSpec$.subscribe((spec) => {
      expect(spec).toEqual({
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        title: 'key / value',
        width: 'container',
        height: 240,
        padding: 10,
        autosize: { type: 'fit', contains: 'padding' },
        data: { values: [{ key: 'A', value: 'V' }] },
        layer: [
          {
            mark: { innerRadius: 30, line: false, point: false, type: 'arc' },
            encoding: {
              color: {
                field: 'key',
                legend: true,
                scale: { scheme: undefined },
                title: '@pry.widget.chart.legendLabel',
                value: undefined
              },
              theta: { field: 'value', type: 'nominal' },
              x: undefined,
              xOffset: undefined,
              y: undefined,
              tooltip: [
                { field: 'key', type: 'nominal', title: undefined },
                { field: 'value', type: 'nominal', title: undefined }
              ]
            }
          }
        ],
        config: {
          text: { font: 'Ubuntu, sans-serif' },
          style: {
            'guide-label': { font: 'Ubuntu, sans-serif' },
            'guide-title': { font: 'Ubuntu, sans-serif' },
            'group-title': { font: 'Ubuntu, sans-serif' },
            'group-subtitle': { font: 'Ubuntu, sans-serif' }
          }
        }
      });
      done();
    });
  });

  it('should allow grouping, and stacking with offset for a line', (done) => {
    const manifest = {
      options: {
        abscissa: {
          keep0: true,
          attribute: '1',
          label: 'ABS'
        },
        ordinate: {
          operation: 'none',
          keep0: true,
          attribute: '2',
          label: 'ORD'
        },
        groupBy: {
          attribute: '3',
          color: 'my-color'
        },
        graph: {
          legend: true,
          tooltip: true,
          type: 'line-default',
          offset: true,
          stacked: true
        }
      } as ChartAggregatedWidgetOptions,
      datasource: 'a'
    } as WidgetManifest;
    DashboardSelectors.widgetManifest(0).setResult(manifest);
    component._manifest$ = of(manifest);
    component.widgetIndex = 0;
    // @ts-ignore
    component._widgetSize$.next({ width: 300, height: 300 });
    component.vegaLiteSpec$.subscribe((spec) => {
      expect(spec).toEqual({
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        title: 'ABS / ORD',
        width: 'container',
        height: 240,
        padding: 10,
        autosize: { type: 'fit', contains: 'padding' },
        data: { values: [{ key: 'A', value: 'V', series: 'ORD' }] },
        layer: [
          {
            mark: { innerRadius: 30, line: true, point: false, type: 'line' },
            encoding: {
              color: {
                field: 'series',
                legend: true,
                scale: { scheme: 'my-color' },
                title: 'field-name-3'
              },
              theta: undefined,
              x: {
                axis: { grid: false, labelExpr: 'height < 300 ? truncate(datum.value, 10) : datum.value' },
                bin: false,
                field: 'key',
                scale: { zero: true },
                timeUnit: undefined,
                title: 'ABS',
                type: 'nominal'
              },
              xOffset: { field: 'series' },
              y: {
                axis: {},
                field: 'value',
                scale: { zero: false },
                stack: true,
                title: 'ORD',
                type: 'nominal'
              },
              tooltip: [
                { field: 'key', type: 'nominal', title: 'ABS' },
                { field: 'value', type: 'nominal', title: 'ORD' },
                { field: 'series', type: 'nominal', title: 'field-name-3' }
              ]
            }
          }
        ],
        config: {
          text: { font: 'Ubuntu, sans-serif' },
          style: {
            'guide-label': { font: 'Ubuntu, sans-serif' },
            'guide-title': { font: 'Ubuntu, sans-serif' },
            'group-title': { font: 'Ubuntu, sans-serif' },
            'group-subtitle': { font: 'Ubuntu, sans-serif' }
          }
        }
      });
      done();
    });
  });

  it('should allow grouping, and stacking with offset for a bar', (done) => {
    const manifest = {
      options: {
        abscissa: {
          keep0: true,
          attribute: '1',
          label: 'ABS'
        },
        ordinate: {
          operation: 'none',
          keep0: true,
          attribute: '2',
          label: 'ORD'
        },
        groupBy: {
          attribute: '3',
          color: 'my-color'
        },
        graph: {
          legend: true,
          tooltip: true,
          type: 'bar-default',
          offset: true,
          stacked: true
        }
      } as ChartAggregatedWidgetOptions,
      datasource: 'a'
    } as WidgetManifest;
    DashboardSelectors.widgetManifest(0).setResult(manifest);
    component._manifest$ = of(manifest);
    component.widgetIndex = 0;
    // @ts-ignore
    component._widgetSize$.next({ width: 300, height: 300 });
    component.vegaLiteSpec$.subscribe((spec) => {
      expect(spec).toEqual({
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        title: 'ABS / ORD',
        width: 'container',
        height: 240,
        padding: 10,
        autosize: { type: 'fit', contains: 'padding' },
        data: { values: [{ key: 'A', value: 'V', series: 'ORD' }] },
        layer: [
          {
            mark: { innerRadius: 30, line: false, point: false, type: 'bar' },
            encoding: {
              color: {
                field: 'series',
                legend: true,
                scale: { scheme: 'my-color' },
                title: 'field-name-3'
              },
              theta: undefined,
              x: {
                axis: { grid: false, labelExpr: 'height < 300 ? truncate(datum.value, 10) : datum.value' },
                bin: false,
                field: 'key',
                scale: { zero: true },
                timeUnit: undefined,
                title: 'ABS',
                type: 'nominal'
              },
              xOffset: undefined,
              y: {
                axis: {},
                field: 'value',
                scale: { zero: false },
                title: 'ORD',
                type: 'nominal'
              },
              tooltip: [
                { field: 'key', type: 'nominal', title: 'ABS' },
                { field: 'value', type: 'nominal', title: 'ORD' },
                { field: 'series', type: 'nominal', title: 'field-name-3' }
              ]
            }
          }
        ],
        config: {
          text: { font: 'Ubuntu, sans-serif' },
          style: {
            'guide-label': { font: 'Ubuntu, sans-serif' },
            'guide-title': { font: 'Ubuntu, sans-serif' },
            'group-title': { font: 'Ubuntu, sans-serif' },
            'group-subtitle': { font: 'Ubuntu, sans-serif' }
          }
        }
      });
      done();
    });
  });
});
