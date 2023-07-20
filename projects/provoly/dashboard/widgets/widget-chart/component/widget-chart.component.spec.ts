import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ChartOptionDefault,
  ChartWidgetOptions,
  ClassSelectors,
  ConfigSelectors,
  DashboardSelectors,
  FieldSelectors,
  FieldType,
  MarkType,
  PryI18nService,
  WidgetManifest
} from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { lastValueFrom, of } from 'rxjs';
import { StandardType } from 'vega-lite/build/src/type';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPrySelectComponent } from '../../../mock/components/mock-pry-select.component';
import { MockPrySettingsComponent } from '../../../mock/components/mock-pry-settings.component';
import { MockPryWidgetHeaderComponent } from '../../../mock/components/mock-pry-widget-header.component';
import { mockVariablesWidgetCharts } from '../../../mock/data/mockVariablesWidgetCharts';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { WidgetChartComponent } from './widget-chart.component';

describe('WidgetChartComponent', () => {
  let component: WidgetChartComponent;
  let fixture: ComponentFixture<WidgetChartComponent>;
  let store: MockStore;
  let barOptions: ChartWidgetOptions;
  let pointsOptions: ChartWidgetOptions;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        WidgetChartComponent,
        MockPrySelectComponent,
        MockPrySettingsComponent,
        MockPryCheckboxComponent,
        MockTranslatePipe,
        MockPryWidgetHeaderComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PryI18nService, useValue: { instant: (key: string) => key } },
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.resultSets,
              value: {
                a: {
                  items: {
                    a: [{ id: '5', oClass: 'a', attributes: { test: { value: 4, type: 'VALUE', visible: true } } }],
                    b: [{ id: '5', oClass: 'b', attributes: { test2: { value: 4, type: 'VALUE', visible: true } } }],
                    c: [{ id: '5', oClass: 'c', attributes: { test2: { value: 4, type: 'VALUE', visible: true } } }]
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
                { id: 'a', attributes: [{ id: '1', field: 'f1', name: 'field-name-1' }] },
                { id: 'b', attributes: [{ id: '2', field: 'f2', name: 'field-name-2' }] },
                { id: 'c', attributes: [{ id: '3', field: 'f3', name: 'field-name-3' }] },
                { id: 'd', attributes: [{ id: '4', field: 'f4', name: 'field-name-4' }] }
              ]
            },
            {
              selector: ConfigSelectors.chartOption,
              value: ChartOptionDefault
            }
          ]
        })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    store = TestBed.inject(MockStore);

    barOptions = {
      title: 'test',
      type: MarkType.BAR,
      subType: 'default',
      specToMerge: '',
      selectedVariables: [mockVariablesWidgetCharts[0], mockVariablesWidgetCharts[1]]
    };

    pointsOptions = {
      title: 'test',
      type: MarkType.POINT,
      subType: 'default',
      specToMerge: '',
      selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[2]]
    };
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetChartComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    component._widgetSize$.next({ width: 300, height: 300 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow emitting manifest', () => {
    const spyEmit = jest.spyOn(component.manifestModified, 'emit').mockReturnValue();
    DashboardSelectors.widgetManifest(0).setResult({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: { columns: [] },
      type: 'placeholder'
    });
    component._manifest$ = of({
      layout: { height: 1, width: 1, x: 1, y: 1 },
      options: { columns: [] },
      type: 'placeholder'
    });
    component.widgetIndex = 0;
    component.emitManifest();
    expect(spyEmit).toHaveBeenCalledWith({
      widgetIndex: 0,
      manifest: {
        layout: { height: 1, width: 1, x: 1, y: 1 },
        options: {
          aggregation: 'count',
          columns: [],
          selectedVariables: [{}, {}],
          subType: 'default',
          title: '',
          tooltip: true,
          legend: true,
          type: 'arc',
          locale: 'fr'
        },
        type: 'placeholder'
      }
    });
  });

  it('should emit arc encodings based on options', () => {
    DashboardSelectors.widgetManifest(0).setResult({
      options: {
        selectedVariables: [
          { label: 'test-label-1', name: 'test-name-1', type: 'nominal' },
          { label: 'test-label-2', name: 'test-name-2', type: 'quantitative' }
        ],
        type: 'arc',
        subType: 'default'
      } as ChartWidgetOptions,
      datasource: 'a'
    } as WidgetManifest);
    component.widgetIndex = 0;
    component._manifest$ = of({
      options: {
        selectedVariables: [
          { label: 'test-label-1', name: 'test-name-1', type: 'nominal' },
          { label: 'test-label-2', name: 'test-name-2', type: 'quantitative' }
        ],
        type: 'arc',
        subType: 'default'
      } as ChartWidgetOptions,
      datasource: 'a'
    } as WidgetManifest);
    component.optionsCopy = {
      title: 'test',
      type: MarkType.ARC,
      subType: 'Default',
      specToMerge: '',
      selectedVariables: [
        { label: 'test-label-1', name: 'test-name-1', type: 'nominal' },
        { label: 'test-label-2', name: 'test-name-2', type: 'quantitative' }
      ]
    };
    let expectedEncodingsArc = {
      subType: 'default',
      type: 'arc',
      aggregation: 'count',
      selectedVariables: [
        {
          label: 'test-label-1',
          name: 'test-name-1',
          type: 'nominal'
        },
        {
          label: 'test-label-2',
          name: 'test-name-2',
          type: 'quantitative'
        }
      ],
      tooltip: true,
      legend: true,
      title: 'field-name-1, field-name-2',
      locale: 'fr'
    };

    expect(component.options$).toBeObservable(hot('b', { b: expectedEncodingsArc }));
  });

  it('should emit extended encodings based on options', () => {
    DashboardSelectors.widgetManifest(0).setResult({
      options: {
        selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[2], mockVariablesWidgetCharts[3]],
        type: 'bar',
        subType: 'stacked'
      } as ChartWidgetOptions,
      datasource: 'a'
    } as WidgetManifest);
    component._manifest$ = of({
      options: {
        selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[2], mockVariablesWidgetCharts[3]],
        type: 'bar',
        subType: 'stacked'
      } as ChartWidgetOptions,
      datasource: 'a'
    } as WidgetManifest);

    component.optionsCopy = {
      title: 'test',
      type: MarkType.BAR,
      subType: 'stacked',
      specToMerge: '',
      selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[2], mockVariablesWidgetCharts[3]]
    };
    let expectedEncodingsThreeVars = {
      subType: 'stacked',
      type: 'bar',
      aggregation: 'count',
      selectedVariables: [
        {
          label: 'test-label-1',
          name: 'test-name-1',
          type: 'nominal'
        },
        {
          label: 'test-label-2',
          name: 'test-name-2',
          type: 'nominal'
        },
        {
          label: 'test-label-3',
          name: 'test-name-3',
          type: 'quantitative'
        }
      ],
      title: 'field-name-1, field-name-2',
      legend: true,
      tooltip: true,
      locale: 'fr'
    };
    expect(component.options$).toBeObservable(hot('b', { b: expectedEncodingsThreeVars }));
  });

  it('should automatically change the chart title on name change', () => {
    DashboardSelectors.widgetManifest(0).setResult({
      options: {
        selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[6]],
        type: 'bar',
        subType: 'default'
      } as ChartWidgetOptions,
      datasource: 'a'
    } as WidgetManifest);

    component._manifest$ = of({
      options: {
        selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[6]],
        type: 'bar',
        subType: 'default'
      } as ChartWidgetOptions,
      datasource: 'a'
    } as WidgetManifest);

    component.widgetIndex = 0;
    component.emitManifest();

    const values = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      autosize: { contains: 'padding', type: 'fit' },
      data: { values: [] },
      height: 'container',
      layer: [
        {
          encoding: {
            x: {
              axis: undefined,
              bin: false,
              field: 'attributes.test-name-1.value',
              scale: { type: undefined, zero: false },
              timeUnit: undefined,
              title: 'test-label-1',
              type: 'nominal'
            },
            y: {
              aggregate: 'count',
              axis: undefined,
              field: 'attributes.test-name_utc.value',
              scale: { type: 'utc', zero: undefined },
              timeUnit: undefined,
              title: 'test-label_utc',
              type: 'quantitative'
            }
          },
          mark: { innerRadius: undefined, line: false, point: false, type: 'bar', tooltip: true }
        }
      ],
      padding: 0,
      title: 'field-name-1, field-name-2',
      width: 'container'
    };

    expect(lastValueFrom(component.vegaLiteSpec$)).resolves.toEqual(values);
    expect(component.optionsCopy.selectedVariables).toEqual([
      mockVariablesWidgetCharts[1],
      mockVariablesWidgetCharts[6]
    ]);
    expect(component.optionsCopy.title).toEqual('field-name-1, field-name-2');
  });

  it('should change the chart title', () => {
    component.staticManifest = {
      options: {
        selectedVariables: [mockVariablesWidgetCharts[0], mockVariablesWidgetCharts[4]],
        type: 'bar',
        subType: 'default'
      } as ChartWidgetOptions,
      datasource: 'a'
    } as WidgetManifest;

    component.optionsCopy = barOptions;
    component.changeChartTitle('my-new-title');
    expect(component.optionsCopy.customTitle).toEqual('my-new-title');
    component.emitManifest();

    const spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      autosize: { contains: 'padding', type: 'fit' },
      data: { values: [] },
      height: 'container',
      layer: [
        {
          encoding: {
            x: {
              axis: undefined,
              bin: false,
              field: 'attributes.test-name.value',
              scale: { type: undefined, zero: false },
              timeUnit: undefined,
              title: 'test-label',
              type: 'nominal'
            },
            y: {
              aggregate: 'count',
              axis: undefined,
              field: 'attributes.test-name-three.value',
              scale: { type: undefined, zero: undefined },
              timeUnit: undefined,
              title: 'test-label-three',
              type: 'quantitative'
            }
          },
          mark: { innerRadius: undefined, line: false, point: false, type: 'bar', tooltip: true }
        }
      ],
      padding: 0,
      title: 'field-name-1, field-name-2',
      width: 'container'
    };

    expect(lastValueFrom(component.vegaLiteSpec$)).resolves.toEqual(spec);
  });

  it('should change the time unit', () => {
    component.optionsCopy = {
      title: 'test',
      type: MarkType.BAR,
      subType: 'Default',
      specToMerge: '',
      selectedVariables: [mockVariablesWidgetCharts[6]]
    };

    const variable = { ...mockVariablesWidgetCharts[6] };
    component.changeTimeUnit('year', variable);
    expect(variable.timeUnit).toEqual('year');
    component.changeTimeUnit('week', variable);
    expect(variable.timeUnit).toEqual('week');
  });

  it('should change the label of the selected variable', () => {
    component.optionsCopy = barOptions;
    component.changeLabel('new-label', 0);
    expect(component.optionsCopy.selectedVariables[0].label).toEqual('new-label');
  });

  describe('should change the type of chart (which in vega is called mark)', () => {
    it('to bar chart', () => {
      component.optionsCopy = pointsOptions;

      component.changeType(MarkType.BAR);
      expect(component.optionsCopy.type).toEqual('bar');
      // @ts-ignore
      expect(component.optionsCopy.subType).toEqual(component.subTypes[MarkType.BAR][0]);
    });

    it('to line chart', () => {
      component.optionsCopy = pointsOptions;
      component.changeType(MarkType.LINE);
      expect(component.optionsCopy.type).toEqual('line');
      // @ts-ignore
      expect(component.optionsCopy.subType).toEqual(component.subTypes[MarkType.LINE][0]);
    });

    it('to point chart', () => {
      component.optionsCopy = {
        type: 'bar',
        subType: 'default',
        selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[2]]
      } as ChartWidgetOptions;

      component.changeType(MarkType.POINT);
      expect(component.optionsCopy.type).toEqual('point');
      // @ts-ignore
      expect(component.optionsCopy.subType).toEqual(component.subTypes[MarkType.POINT][0]);
    });

    it('to circular chart (arc)', () => {
      DashboardSelectors.widgetManifest(0).setResult({
        options: {
          type: 'bar',
          subType: 'Default',
          selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[2]]
        } as ChartWidgetOptions,
        datasource: 'a'
      } as WidgetManifest);
      component._manifest$ = of({
        options: {
          type: 'bar',
          subType: 'Default',
          selectedVariables: [mockVariablesWidgetCharts[1], mockVariablesWidgetCharts[2]]
        } as ChartWidgetOptions,
        datasource: 'a'
      } as WidgetManifest);
      component.widgetIndex = 0;
      component.changeType(MarkType.ARC);
      component.emitManifest();

      let encoding = {
        subType: 'Default',
        type: 'bar',
        aggregation: 'count',
        legend: true,
        selectedVariables: [
          {
            label: 'test-label-1',
            name: 'test-name-1',
            type: 'nominal'
          },
          {
            label: 'test-label-2',
            name: 'test-name-2',
            type: 'nominal'
          }
        ],
        tooltip: true,
        title: 'field-name-1, field-name-2',
        locale: 'fr'
      };

      expect(component.optionsCopy.type).toEqual('arc');
      // @ts-ignore
      expect(component.optionsCopy.subType).toEqual(component.subTypes[MarkType.ARC][0]);
      expect(component.options$).toBeObservable(hot('b', { b: encoding }));
    });
  });

  describe('should check whether the origin of the graph is at zero', () => {
    it('for x axis', () => {
      component.optionsCopy = {
        type: 'point',
        subType: 'default',
        selectedVariables: [mockVariablesWidgetCharts[1]]
      } as ChartWidgetOptions;
    });
    it('for y axis', () => {
      component.optionsCopy = {
        type: 'point',
        subType: 'default',
        selectedVariables: [mockVariablesWidgetCharts[1]]
      } as ChartWidgetOptions;
    });
  });

  it('should toggle the axe origin of the chart', () => {
    component.optionsCopy = {
      type: 'point',
      subType: 'default',
      selectedVariables: [mockVariablesWidgetCharts[1]]
    } as ChartWidgetOptions;
  });

  describe('should translate FieldType to Vega type', () => {
    type valueTypes = [FieldType, string, StandardType];
    let values: Array<valueTypes> = [
      [FieldType.DECIMAL, 'decimal-variable', 'quantitative'],
      [FieldType.INTEGER, 'integer-variable', 'quantitative'],
      [FieldType.LONG, 'long-variable', 'quantitative'],
      [FieldType.INSTANT, 'instance-variable', 'temporal'],
      [FieldType.KEYWORD, 'keyword-variable', 'nominal'],
      [FieldType.STRING, 'string-variable', 'nominal']
    ];
    test.each(values)(
      'translate from FieldType to Vega Type, %s (%s) to %s',
      (fieldType: FieldType, fieldLabel: string, expected: StandardType) => {
        expect(component.translateToVegaType(fieldType, fieldLabel)).toBe(expected);
      }
    );
  });

  it('should translate data types with "id" in their name to Vega data type "ordinal"', () => {
    let vegatype = component.translateToVegaType(FieldType.LONG, 'my_id');
    expect(vegatype).toEqual('ordinal');

    vegatype = component.translateToVegaType(FieldType.STRING, '__ID__');
    expect(vegatype).toEqual('ordinal');
  });
});
