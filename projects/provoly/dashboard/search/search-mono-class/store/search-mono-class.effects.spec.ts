import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SearchService } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { SearchMonoClassEffects } from './search-mono-class.effects';
import { initialSearchMonoClassState, SearchMonoClassState } from './search-mono-class.reducer';
import { SearchMonoClassService } from './search-mono-class.service';

const buildState = (state: Partial<SearchMonoClassState>) =>
  Object.assign({}, { '@pry/search': JSON.parse(JSON.stringify({ ...initialSearchMonoClassState, ...state })) });

describe('SearchMonoClassEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchMonoClassEffects;
  let searchService: SearchService;
  let searchMonoClassService: SearchMonoClassService;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SearchMonoClassEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: SearchMonoClassService,
          useValue: {
            initNormalizedConditionComposed: () => jest.fn()
          }
        },
        {
          provide: SearchService,
          useValue: {
            search: () => jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(SearchMonoClassEffects);
    searchMonoClassService = TestBed.inject<SearchMonoClassService>(SearchMonoClassService);
    searchService = TestBed.inject<SearchService>(SearchService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
