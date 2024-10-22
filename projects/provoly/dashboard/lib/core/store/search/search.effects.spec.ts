import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { Item } from '../../model/item.interface';
import { ResultSet } from '../../model/result-set.interface';
import { SearchActions } from './search.actions';
import { DEFAULT_NAMED_QUERY_ID } from './search.constants';

import { SearchEffects } from './search.effects';
import { initialSearchState, SearchState } from './search.reducer';
import { SearchService } from './search.service';
import { WidgetFactoryService, WidgetManifest } from '@provoly/dashboard';

const buildState = (state: Partial<SearchState>) =>
  Object.assign({}, { '@pry/search': JSON.parse(JSON.stringify({ ...initialSearchState, ...state })) });

describe('SearchEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let searchService: SearchService;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: SearchService,
          useValue: {
            search: () => jest.fn()
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
});
