import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PryNotificationComponent } from '@provoly/dashboard/notification';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { SearchService } from '../search/search.service';
import { DataSourceActions } from './data-source.actions';
import { DataSourceEffects } from './data-source.effects';
import { NamedQuery } from './data-source.model';
import { DataSourceState, initialDataSourceState } from './data-source.reducer';
import { DataSourceService } from './data-source.service';
import { NamedQueryTypes } from './named-query-types.model';

const buildState = (state: Partial<DataSourceState>) =>
  Object.assign({}, { '@pry/datasources': JSON.parse(JSON.stringify({ ...initialDataSourceState, ...state })) });

export const namedQueryList: NamedQuery[] = [
  {
    id: 'fakeid',
    sourceType: 'namedQuery',
    name: 'fakename',
    description: 'fakedescription',
    request: {
      type: NamedQueryTypes.MONO_CLASS,
      fullSearch: null,
      oClass: '9e397c90-b109-423d-812b-3c4ff815ce71',
      condition: {
        type: 'AND',
        composed: []
      },
      sort: {
        attribute: 'a',
        direction: 'asc'
      }
    }
  },
  {
    id: 'fakeid2',
    sourceType: 'namedQuery',
    name: 'fakename2',
    description: 'fakedescription2',
    request: {
      type: NamedQueryTypes.MONO_CLASS,
      fullSearch: null,
      oClass: '9e397c90-b109-423d-812b-3c4ff815ce71',
      condition: {
        type: 'AND',
        composed: []
      },
      sort: {
        attribute: 'a',
        direction: 'desc'
      }
    }
  }
];

describe('DataSourceEffects', () => {
  let actions$: Observable<any>;
  let effects: DataSourceEffects;
  const initialState = initialDataSourceState;
  let searchService: SearchService;
  let namedQueryService: DataSourceService;
  let snackbarService: PrySnackbarService;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DataSourceEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        { provide: PryI18nService, useValue: { instant: (key: string) => key } },
        {
          provide: DataSourceService,
          useValue: {
            get: () => of(namedQueryList),
            delete: () => null,
            getDatasetVersionsById: () => of([])
          }
        },
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => null
          }
        },
        {
          provide: PryNotificationComponent,
          useValue: {}
        }
      ]
    });

    effects = TestBed.inject(DataSourceEffects);
    searchService = TestBed.inject<SearchService>(SearchService);
    namedQueryService = TestBed.inject<DataSourceService>(DataSourceService);
    snackbarService = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('postNameQuery$', function () {});

  describe('getNamedQuery$', function () {
    /* jest-marbles and debounceTime are not great buddies
    it('should return namedQueries', () => {
      const getSpy = jest.spyOn(namedQueryService, 'get');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: DataSourceActions.namedQuery.load()
      });

      const expected$ = hot('--a-', {
        a: DataSourceActions.namedQuery.loaded({ list: namedQueryList })
      });
      expect(effects.getNamedQuery$).toBeObservable(expected$);
      expect(effects.getNamedQuery$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call to failure on error', () => {
      const getSpy = jest.spyOn(namedQueryService, 'get').mockImplementation(() => {
        throw new Error('fake message');
      });
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a', {
        a: DataSourceActions.namedQuery.load()
      });

      const expected$ = hot('--(a|)', {
        a: DataSourceActions.namedQuery.failure({ error: Error('fake message') })
      });
      expect(effects.getNamedQuery$).toBeObservable(expected$);
      expect(effects.getNamedQuery$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });*/
  });

  describe('deleteNamedQuery$', function () {
    it('should call to load after delete completed', () => {
      const getSpy = jest.spyOn(namedQueryService, 'delete').mockReturnValue(of({ data: { success: true } }));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: DataSourceActions.namedQuery.delete({ id: 'fakeid' })
      });

      const expected$ = hot('--a-', {
        a: DataSourceActions.namedQuery.load()
      });
      expect(effects.deleteNamedQuery$).toBeObservable(expected$);
      expect(effects.deleteNamedQuery$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('addFavoriteNamedQuery$', function () {});

  describe('deleteFavoriteNamedQuery$', function () {});

  describe('tryEdit$', function () {});

  describe('updateWidgetAfterSave$', function () {});

  describe('loadedDataset$', function () {});

  describe('listVersionsById$', function () {
    it('should trigger updateVersionList once versions received', () => {
      const getSpy = jest.spyOn(namedQueryService, 'getDatasetVersionsById').mockReturnValue(of([]));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: DataSourceActions.dataset.listVersionsByDatasetId({ id: 'fakeid' })
      });

      const expected$ = hot('--a-', {
        a: DataSourceActions.dataset.updateVersionList({ id: 'fakeid', versions: [] })
      });
      expect(effects.listVersionsById$).toBeObservable(expected$);
      expect(effects.listVersionsById$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
