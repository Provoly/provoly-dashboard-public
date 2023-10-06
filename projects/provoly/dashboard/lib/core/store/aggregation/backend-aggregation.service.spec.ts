import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  AggregationResult,
  ChartAggregatedWidgetOptions,
  ClassSelectors,
  ConfigSelectors,
  DashboardSelectors,
  FieldSelectors,
  FilterContext,
  Operation,
  PryBackendAggregationService,
  PryI18nService,
  PrySnackbarService,
  SearchService,
  ValueType
} from '@provoly/dashboard';

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

describe('BackendAggregationService', () => {
  let service: PryBackendAggregationService;
  let httpTestingController: HttpTestingController;
  let snackBar: PrySnackbarService;
  let translateService: PryI18nService;

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => null
          }
        },
        {
          provide: SearchService,
          useValue: {
            getItemsFilter: (id: string, params: HttpParams) => params.append('mock', 'true')
          }
        },
        {
          provide: PryI18nService,
          useValue: {
            instant: () => 'translated'
          }
        },
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.dataUrl,
              value: 'data'
            },
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
              selector: FieldSelectors.fields,
              value: [
                { id: 'f1', name: 'field-name-1', type: 'string' },
                { id: 'f2', name: 'field-name-2', type: 'string' },
                { id: 'f3', name: 'field-name-3', type: 'integer' },
                { id: 'f4', name: 'field-name-4', type: 'instant' }
              ]
            }
          ]
        })
      ]
    });

    service = TestBed.inject(PryBackendAggregationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    snackBar = TestBed.inject(PrySnackbarService);
    translateService = TestBed.inject(PryI18nService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('aggregate warnings', () => {
    it('should show snackbar if more than one datasource supplied', () => {
      jest.spyOn(global.console, 'warn').mockReturnValue();
      const spy = jest.spyOn(snackBar, 'open');
      service.aggregate(['a', 'b'], chartOptions);
      expect(spy).toHaveBeenCalled();
    });
    it('should show snackbar if datasets include DEFAULT NQ or EXPLORE NQ', () => {
      jest.spyOn(global.console, 'warn').mockReturnValue();
      const spy = jest.spyOn(snackBar, 'open');
      service.aggregate(['007'], chartOptions);
      expect(spy).toHaveBeenCalled();
    });
    it('should console.warn if no abscissa or ordinate in options', () => {
      jest.spyOn(global.console, 'warn').mockReturnValue();
      const spy = jest.spyOn(snackBar, 'open');
      service.aggregate(['007'], {} as ChartAggregatedWidgetOptions);
      expect(spy).toHaveBeenCalled();
    });
    it('should console.warn and return if no target datasource', (done) => {
      const spy = jest.spyOn(global.console, 'warn').mockReturnValue();
      let result$ = service.aggregate(['007'], {
        ...chartOptions,
        ordinate: { ...chartOptions.ordinate, operation: Operation.AVERAGE }
      });
      let expectedResult = { operation: Operation.AVERAGE, values: [] } as AggregationResult;
      result$.subscribe((result) => {
        expect(result).toEqual(expectedResult);
        done();
      });
      expect(spy).toHaveBeenCalled();
    });
    it('should console.warn and return if no abscissa attribute', (done) => {
      const spy = jest.spyOn(global.console, 'warn').mockReturnValue();
      let result$ = service.aggregate(['1'], {
        ...chartOptions,
        abscissa: { ...chartOptions.abscissa, attribute: '' },
        ordinate: { ...chartOptions.ordinate, operation: Operation.SUM }
      });
      let expectedResult = { operation: Operation.SUM, values: [] } as AggregationResult;
      result$.subscribe((result) => {
        expect(result).toEqual(expectedResult);
        done();
      });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('if ordinate.operation is specified', () => {
    const chartOptionsWithOperation = {
      ...chartOptions,
      ordinate: { ...chartOptions.ordinate, operation: Operation.AVERAGE }
    } as ChartAggregatedWidgetOptions;

    afterEach(() => {
      httpTestingController.verify();
    });

    it('should GET aggregation result with appropriate params', () => {
      service.aggregate(['1'], chartOptionsWithOperation).subscribe();
      const reqs = httpTestingController.match(() => true);
      expect(reqs.length).toEqual(1);
      const req = reqs[0];
      expect(req.request.url).toEqual('data/data-sources/id/1/items/aggregate');
      expect(req.request.params.get('aggregatedBy')).toEqual('1');
      expect(req.request.params.get('operation')).toEqual('avg');
      expect(req.request.params.get('valueField')).toEqual('2');
      expect(req.request.method).toEqual('GET');
      req.flush({
        operation: Operation.AVERAGE,
        values: [
          {
            key: 'key' as ValueType,
            value: 'value' as ValueType
          }
        ]
      } as AggregationResult);
    });
    it('should GET aggregation result with param dateInterval', () => {
      service
        .aggregate(['1'], {
          ...chartOptionsWithOperation,
          abscissa: {
            ...chartOptions.abscissa,
            limit: {
              interval: 'second',
              isTimeLimit: true
            }
          }
        })
        .subscribe();
      const reqs = httpTestingController.match(() => true);
      expect(reqs.length).toEqual(1);
      const req = reqs[0];
      expect(req.request.url).toEqual('data/data-sources/id/1/items/aggregate');
      expect(req.request.params.get('aggregatedBy')).toEqual('1');
      expect(req.request.params.get('dateInterval')).toEqual('second');
      expect(req.request.params.get('operation')).toEqual('avg');
      expect(req.request.params.get('valueField')).toEqual('2');
      expect(req.request.method).toEqual('GET');
      req.flush({
        operation: Operation.AVERAGE,
        values: [
          {
            key: 'key' as ValueType,
            value: 'value' as ValueType
          }
        ]
      } as AggregationResult);
    });
    it('should GET aggregation result with params interval, limitOrder, limitOthers', () => {
      service
        .aggregate(['1'], {
          ...chartOptionsWithOperation,
          abscissa: {
            ...chartOptions.abscissa,
            limit: {
              at: 1,
              others: true,
              order: 'asc',
              isTimeLimit: false
            }
          }
        })
        .subscribe();
      const reqs = httpTestingController.match(() => true);
      expect(reqs.length).toEqual(1);
      const req = reqs[0];
      expect(req.request.url).toEqual('data/data-sources/id/1/items/aggregate');
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('interval')).toEqual('1');
      expect(req.request.params.get('limitOrder')).toEqual('asc');
      expect(req.request.params.get('limitOthers')).toEqual('true');
      expect(req.request.params.get('aggregatedBy')).toEqual('1');
      expect(req.request.params.get('operation')).toEqual('avg');
      expect(req.request.params.get('valueField')).toEqual('2');
      req.flush({
        operation: Operation.AVERAGE,
        values: [
          {
            key: 'key' as ValueType,
            value: 'value' as ValueType
          }
        ]
      } as AggregationResult);
    });
    it('should GET aggregation result with param groupBy', () => {
      service
        .aggregate(['1'], { ...chartOptionsWithOperation, groupBy: { attribute: '1', color: 'blue' } })
        .subscribe();
      const reqs = httpTestingController.match(() => true);
      expect(reqs.length).toEqual(1);
      const req = reqs[0];
      expect(req.request.url).toEqual('data/data-sources/id/1/items/aggregate');
      expect(req.request.params.get('aggregatedBy')).toEqual('1');
      expect(req.request.params.get('operation')).toEqual('avg');
      expect(req.request.params.get('valueField')).toEqual('2');
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('groupBy')).toEqual('1');
      req.flush({
        operation: Operation.AVERAGE,
        values: [
          {
            key: 'key' as ValueType,
            value: 'value' as ValueType
          }
        ]
      } as AggregationResult);
    });
    it('should add filters', () => {
      // @ts-ignore
      service.filters = {
        '1': [
          { attribute: 'attrId', operator: 'CONTAINS', value: 'a' },
          { attribute: 'attrId2', operator: 'CONTAINS', value: 'b' }
        ]
      } as { [datasource: string]: FilterContext[] };
      service.aggregate(['1'], chartOptionsWithOperation).subscribe();
      const reqs = httpTestingController.match(() => true);
      expect(reqs.length).toEqual(1);
      const req = reqs[0];
      expect(req.request.url).toEqual('data/data-sources/id/1/items/aggregate');
      expect(req.request.params.get('aggregatedBy')).toEqual('1');
      expect(req.request.params.get('operation')).toEqual('avg');
      expect(req.request.params.get('valueField')).toEqual('2');
      expect(req.request.params.getAll('mock')).toEqual(['true']);
      expect(req.request.method).toEqual('GET');
      req.flush({
        operation: Operation.AVERAGE,
        values: [
          {
            key: 'key' as ValueType,
            value: 'value' as ValueType
          }
        ]
      } as AggregationResult);
    });
  });

  describe('if ordinate.operation is equal to none', () => {
    const chartOptionsWithoutOperation = {
      ...chartOptions,
      ordinate: { ...chartOptions.ordinate, operation: Operation.NONE }
    } as ChartAggregatedWidgetOptions;

    it('should warn and return if no abscissa or ordinate', (done) => {
      const spy = jest.spyOn(global.console, 'warn').mockReturnValue();
      let result$ = service.aggregate(['test'], {
        ...chartOptionsWithoutOperation,
        abscissa: { ...chartOptions.abscissa, attribute: '' }
      });
      let expectedResult = { operation: Operation.NONE, values: [] } as AggregationResult;
      result$.subscribe((result) => {
        expect(result).toEqual(expectedResult);
        done();
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should call sum with no aggregation', (done) => {
      let expectedResult = {
        operation: Operation.NONE,
        values: [
          {
            key: 'key',
            value: 'value'
          }
        ]
      } as AggregationResult;
      service.aggregate(['a'], chartOptionsWithoutOperation).subscribe((result) => {
        expect(result).toEqual(expectedResult);
        done();
      });

      const reqs = httpTestingController.match(() => true);
      expect(reqs.length).toEqual(1);
      const req = reqs[0];
      expect(req.request.url).toEqual('data/data-sources/id/a/items/aggregate');
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('aggregatedBy')).toEqual('1');
      expect(req.request.params.get('operation')).toEqual('sum');
      expect(req.request.params.get('valueField')).toEqual('2');
      req.flush({
        operation: Operation.SUM,
        values: [
          {
            key: 'key' as ValueType,
            value: 'value' as ValueType
          }
        ]
      } as AggregationResult);
    });
  });
});
