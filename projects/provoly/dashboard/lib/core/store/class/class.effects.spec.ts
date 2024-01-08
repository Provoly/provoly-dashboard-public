import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { mockDatasetsCounts } from '../../../../mock/data/mockItemAdmin';
import { ClassActions } from './class.actions';
import { ClassEffects } from './class.effects';
import { classesFeatureKey, ClassState, initialClassState } from './class.reducer';
import { ClassService } from './class.service';

const buildState = (state: Partial<ClassState>) =>
  Object.assign({}, { [classesFeatureKey]: JSON.parse(JSON.stringify({ ...initialClassState, ...state })) });

describe('ClassEffects', () => {
  let actions$: Observable<any>;
  let effects: ClassEffects;
  let classService: ClassService;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClassEffects,
        provideMockActions(() => actions$),
        provideMockStore({}),
        {
          provide: ClassService,
          useValue: {
            getClasses: () => jest.fn(),
            getDatasetCounts: () => of(mockDatasetsCounts)
          }
        }
      ]
    });

    effects = TestBed.inject(ClassEffects);
    store = TestBed.inject(MockStore);
    classService = TestBed.inject(ClassService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('loadDatasetsCount', () => {
    it('should set flows get by the http GET', () => {
      const getSpy = jest.spyOn(classService, 'getDatasetCounts');
      store.setState(
        buildState({
          ...initialClassState
        })
      );

      actions$ = hot('--a-', {
        a: ClassActions.loadDatasetCount()
      });

      const expected$ = hot('--a-', {
        a: ClassActions.loadDatasetCountSuccess({ datasetCounts: mockDatasetsCounts })
      });
      expect(effects.loadDatasetCount$).toBeObservable(expected$);
      expect(effects.loadDatasetCount$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadFlows failure', () => {
      const getSpy = jest.spyOn(classService, 'getDatasetCounts').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialClassState
        })
      );

      actions$ = hot('--a-', {
        a: ClassActions.loadDatasetCount()
      });

      const expected$ = hot('--a-', {
        a: ClassActions.loadDatasetCountFailure({ error: new Error('error') })
      });
      expect(effects.loadDatasetCount$).toBeObservable(expected$);
      expect(effects.loadDatasetCount$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
