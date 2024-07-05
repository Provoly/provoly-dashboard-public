import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ChartAggregatedWidgetOptions,
  Class,
  ClassSelectors,
  DashboardSelectors,
  FieldSelectors,
  Item,
  Operation,
  PryFrontendAggregationService,
  ResultSets
} from '@provoly/dashboard';
import { AggregationUtils } from './aggregation-utils.class';
import { hot } from 'jest-marbles';

const chartOptions = {
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
} as ChartAggregatedWidgetOptions;

const resultSets = {
  a: {
    items: {
      a: [
        {
          id: '5',
          oClass: 'a',
          attributes: {
            '1': { value: 'attr-1-value', type: 'VALUE', visible: true },
            '2': { value: 20, type: 'VALUE', visible: true },
            '3': { value: 4, type: 'VALUE', visible: true },
            '4': { value: 19090290090, type: 'VALUE', visible: true }
          }
        }
      ]
    },
    relations: []
  }
} as ResultSets;

const classes = [
  {
    id: 'a',
    attributes: [
      { id: '1', field: { name: 'f1', id: 'f1' }, name: '1' },
      { id: '2', field: { name: 'f2', id: 'f2' }, name: '2' },
      { id: '3', field: { name: 'f3', id: 'f3' }, name: '3' },
      { id: '4', field: { name: 'f4', id: 'f4' }, name: '4' }
    ]
  }
] as Class[];

const resultSet = AggregationUtils.getChartDatasourceResultSet(['a'], resultSets);

const items = Object.keys(resultSet.items)
  .map((classId) => resultSet.items[classId])
  .reduce((prev, curr) => [...prev, ...curr], []) as Item[];

describe('FrontAggregationService', () => {
  let service: PryFrontendAggregationService;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.resultSets,
              value: resultSets
            },
            {
              selector: ClassSelectors.classes,
              value: classes
            },
            {
              selector: FieldSelectors.fields,
              value: [
                { id: '1', name: 'field-name-1', type: 'string' },
                { id: '2', name: 'field-name-2', type: 'integer' },
                { id: '3', name: 'field-name-3', type: 'integer' },
                { id: '4', name: 'field-name-4', type: 'instant' }
              ]
            },
            {
              selector: DashboardSelectors.filters,
              value: []
            }
          ]
        })
      ]
    });

    service = TestBed.inject(PryFrontendAggregationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('aggregate', () => {
    it('should return aggregation result observable', () => {
      const expected$ = hot('a', {
        a: { operation: Operation.COUNT, values: [{ key: 'attr-1-value', value: 1 }] }
      });
      expect(
        service.aggregate(['a'], {
          ...chartOptions,
          ordinate: { ...chartOptions.ordinate, operation: Operation.COUNT }
        })
      ).toBeObservable(expected$);
    });
  });

  describe('getAggregationResult', () => {
    it('should return aggregation result with no groupby attribute', () => {
      expect(
        service.getAggregationResult(
          { ...chartOptions, ordinate: { ...chartOptions.ordinate, operation: Operation.COUNT } },
          classes,
          items
        )
      ).toEqual({ operation: 'count', values: [{ key: 'attr-1-value', value: 1 }] });
    });
    it('should return aggregation result with a groupby attribute', () => {
      expect(
        service.getAggregationResult(
          {
            ...chartOptions,
            ordinate: { ...chartOptions.ordinate, operation: Operation.COUNT },
            groupBy: { attribute: '3', color: '' }
          },
          classes,
          items
        )
      ).toEqual({ operation: Operation.COUNT, values: [{ groupBy: [{ key: 'attr-1-value', value: 1 }], key: '4' }] });
    });
  });

  it('should group items by the value of the provided attribute', () => {
    expect(service.getItemsGroupedByAttributeValue(items, chartOptions.ordinate.attribute ?? '')).toEqual({
      '20': [
        {
          id: '5',
          oClass: 'a',
          attributes: {
            '1': {
              type: 'VALUE',
              value: 'attr-1-value',
              visible: true
            },
            '2': {
              type: 'VALUE',
              value: 20,
              visible: true
            },
            '3': {
              type: 'VALUE',
              value: 4,
              visible: true
            },
            '4': {
              type: 'VALUE',
              value: 19090290090,
              visible: true
            }
          }
        }
      ]
    });
  });

  it('should return chart data in { key, value }[] format', () => {
    expect(
      service.getChartDataBasedOnOperation(
        items,
        Operation.COUNT,
        chartOptions.abscissa.attribute,
        chartOptions.ordinate.attribute ?? ''
      )
    ).toEqual([{ key: 'attr-1-value', value: 1 }]);
  });
});
