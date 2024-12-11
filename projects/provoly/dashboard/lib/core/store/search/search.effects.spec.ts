import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { Item } from '../../model/item.interface';
import { ResultSet } from '../../model/result-set.interface';
import { SearchActions } from './search.actions';
import { DEFAULT_NAMED_QUERY_ID } from './search.constants';

import { SearchEffects } from './search.effects';
import { initialSearchState, SearchState } from './search.reducer';
import { SearchService } from './search.service';
import { DashboardSelectors, WidgetFactoryService, WidgetManifest } from '@provoly/dashboard';
import { TestScheduler } from 'rxjs/testing';

const buildState = (state: Partial<SearchState>) =>
  Object.assign({}, { '@pry/search': structuredClone({ ...initialSearchState, ...state }) });

describe('SearchEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let searchService: SearchService;
  let store: MockStore<any>;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: buildState({}),
          selectors: [
            { selector: DashboardSelectors.rank, value: 0 },
            {
              selector: DashboardSelectors.quickOrder,
              value: {}
            },
            {
              selector: DashboardSelectors.resultSets,
              value: {}
            }
          ]
        }),
        {
          provide: SearchService,
          useValue: {
            search: () => jest.fn(),
            getItems: () => jest.fn(),
            getItemsSerializedParams: () => jest.fn()
          }
        },
        {
          provide: WidgetFactoryService,
          useValue: {
            datasourcesToAutoLoad: (wm: WidgetManifest) =>
              (Array.isArray(wm.datasource) ? wm.datasource : [wm.datasource]).map((ds) => ({
                datasetId: ds,
                excludeGeo: true
              }))
          }
        }
      ]
    });

    effects = TestBed.inject(SearchEffects);
    searchService = TestBed.inject<SearchService>(SearchService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('searchSuccess$', () => {
    it('should send a searchMonoClass action if only one class in filteredClassesId  ', () => {
      actions$ = hot('--a-', {
        a: SearchActions.searchSuccess({
          resultSet: {
            items: {
              clazzA: [{} as Item],
              clazzB: [{} as Item]
            },
            relations: []
          } as ResultSet
        })
      });

      const expected$ = hot('--a-', {
        a: DashboardActions.updateResultSet({
          id: DEFAULT_NAMED_QUERY_ID,
          resultSet: {
            items: {
              clazzA: [{} as Item],
              clazzB: [{} as Item]
            },
            relations: []
          }
        })
      });
      expect(effects.searchSuccess$).toBeObservable(expected$);
    });
  });

  describe('searchNamed$', () => {
    it('should ask for all needed datasources items, but no more', () => {
      testScheduler.run(({ cold, expectObservable, hot }) => {
        const resultSet = {
          items: {
            clazzA: [{ id: 'a' } as Item],
            clazzB: [{ id: 'b' } as Item]
          },
          relations: []
        } as ResultSet;

        const getItemsSpy = jest.spyOn(searchService, 'getItems').mockReturnValue(of(resultSet));
        const getParamsSpy = jest.spyOn(searchService, 'getItemsSerializedParams').mockReturnValue('||');

        actions$ = hot('--(bac)-', {
          a: SearchActions.getDatasourceItems({
            id: 'ds1',
            excludeGeo: true,
            from: 'tua',
            next: false
          }),
          b: SearchActions.getDatasourceItems({
            id: 'ds2',
            excludeGeo: true,
            from: 'tua',
            next: false
          }),
          c: SearchActions.getDatasourceItems({
            id: 'ds1',
            excludeGeo: true,
            from: 'tua',
            next: false
          })
        });

        expect(effects.searchNamed$).toSatisfyOnFlush(() => {
          expect(getItemsSpy).toHaveBeenCalledTimes(2);
        });
        expectObservable(effects.searchNamed$).toBe('100ms --(ab)-', {
          a: SearchActions.searchSuccess({
            resultSet,
            id: 'ds2',
            params: searchService.getItemsSerializedParams('ds1', undefined, false, undefined),
            next: false
          }),
          b: SearchActions.searchSuccess({
            resultSet,
            id: 'ds1',
            params: searchService.getItemsSerializedParams('ds2', undefined, false, undefined),
            next: false
          })
        });
      });
    });
  });
});
