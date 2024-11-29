import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ClassSelectors,
  DataSourceSelectors,
  MultiClassCondition,
  NamedQueryTypes,
  SearchActions,
  SearchService
} from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { SearchMultiClassActions } from './search-multi-class.actions';
import { SearchMultiClassEffects } from './search-multi-class.effects';
import { initialSearchState, SearchMultiClassState } from './search-multi-class.reducer';
import { SearchMultiClassSelectors } from './search-multi-class.selectors';
import { SearchMultiClassService } from './search-multi-class.service';

const conditions: MultiClassCondition[] = [
  {
    field: 'ea1f6255-9e67-41e6-89a2-1c1bd5a0a5ce',
    id: 'e54fff6d-1cc2-4dd7-99a1-0b30a988ea27',
    isDate: false,
    operator: 'EQUALS',
    pattern: '^[+-]?([0-9]*[.])?[0-9]+$',
    value: '30'
  }
];

const multiType = 'AND';

const classes = [
  {
    attributes: [
      {
        category: 'cf666d66-838f-4d92-a4d2-a315df21fac9',
        field: '59853619-9773-418a-ace5-70b80fd4dc74',
        id: '940f5738-c0bf-4fd4-96af-8f319e6fd445',
        multiValued: false,
        name: 'latitude'
      },
      {
        category: 'cf666d66-838f-4d92-a4d2-a315df21fac9',
        field: '59853619-9773-418a-ace5-70b80fd4dc74',
        id: '940f5738-c0bf-4fd4-96af-8f319e6fd445',
        multiValued: false,
        name: 'latitude'
      }
    ],
    id: 'd260d53d-3529-4712-bedb-6517ecad5784',
    name: 'caracteristique'
  },
  {
    attributes: [
      {
        category: 'cf666d66-838f-4d92-a4d2-a315df21fac9',
        field: '59853619-9773-418a-ace5-70b80fd4dc74',
        id: '940f5738-c0bf-4fd4-96af-8f319e6fd445',
        multiValued: false,
        name: 'latitude'
      },
      {
        category: 'cf666d66-838f-4d92-a4d2-a315df21fac9',
        field: '59853619-9773-418a-ace5-70b80fd4dc74',
        id: '940f5738-c0bf-4fd4-96af-8f319e6fd445',
        multiValued: false,
        name: 'latitude'
      }
    ],
    id: '534ff6cd-0a85-4612-82c0-7f83e9ce2caa',
    name: 'lieu'
  }
];

const currentEdit = {
  id: '007',
  name: 'Recherche courante',
  request: {
    fields: [
      {
        field: 'ea1f6255-9e67-41e6-89a2-1c1bd5a0a5ce',
        operator: 'EQUALS',
        value: '30'
      }
    ],
    fullSearch: null,
    multiType: 'AND',
    oClasses: ['17b90da3-f448-4cc3-bfd8-74c8b8481590'],
    type: 'MULTI_CLASS'
  }
};

const buildState = (state: Partial<SearchMultiClassState>) =>
  Object.assign({}, { '@pry/search/multi-class': structuredClone({ ...initialSearchState, ...state }) });

describe('effectsMultiSearch', () => {
  let store: MockStore<any>;
  let actions$: Observable<any>;
  let effects: SearchMultiClassEffects;
  let searchMultiClassService: SearchMultiClassService;
  let searchService: SearchService;
  const initialState = initialSearchState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchMultiClassEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: { ...initialState },
          selectors: [
            {
              selector: SearchMultiClassSelectors.conditions,
              value: conditions
            },
            {
              selector: SearchMultiClassSelectors.multiType,
              value: multiType
            },
            {
              selector: ClassSelectors.classes,
              value: classes
            },
            {
              selector: DataSourceSelectors.currentEdit,
              value: currentEdit
            }
          ]
        })
      ]
    });
    effects = TestBed.inject(SearchMultiClassEffects);
    searchMultiClassService = TestBed.inject<SearchMultiClassService>(SearchMultiClassService);
    searchService = TestBed.inject<SearchService>(SearchService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('shouldBeCalledSearch', () => {
    store.setState(
      buildState({
        ...initialState
      })
    );

    actions$ = hot('--a-', {
      a: SearchMultiClassActions.search()
    });

    const expected = hot('--a-', {
      a: SearchActions.search({
        payload: {
          fullSearch: null,
          type: NamedQueryTypes.MULTI_CLASS,
          multiType: 'AND',
          oClasses: [],
          fields: [
            {
              field: 'ea1f6255-9e67-41e6-89a2-1c1bd5a0a5ce',
              operator: 'EQUALS',
              value: '30'
            }
          ]
        }
      })
    });
    expect(effects.actionMultiClassSearch$).toBeObservable(expected);
  });

  it('shouldPassThrowIf', () => {
    store.setState(
      buildState({
        ...initialState
      })
    );

    actions$ = hot('--a-', {
      a: SearchMultiClassActions.save({
        descriptionQuery: {
          description: undefined,
          name: 'Recherche courante'
        },
        id: '007'
      })
    });

    const expected = hot('--a-', {
      a: SearchActions.search({
        payload: {
          fullSearch: null,
          type: NamedQueryTypes.MULTI_CLASS,
          multiType: 'AND',
          oClasses: [],
          fields: [
            {
              field: 'ea1f6255-9e67-41e6-89a2-1c1bd5a0a5ce',
              operator: 'EQUALS',
              value: '30'
            }
          ]
        }
      })
    });
    expect(effects.actionMultiClassSearch$).toBeObservable(expected);
  });
});
