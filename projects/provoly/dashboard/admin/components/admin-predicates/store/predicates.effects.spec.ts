import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Predicate } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { PredicatesActions } from './predicates.actions';
import { PredicatesEffects } from './predicates.effects';
import { initialPredicateState, PredicateState } from './predicates.reducer';

const buildState = (state: Partial<PredicateState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialPredicateState, ...state })) });

const predicates: Predicate[] = [
  {
    name: 'predicate',
    id: '1',
    value: 'value'
  }
];

const routeToPred = '/';

describe('PredicatesEffects', () => {
  let actions$: Observable<any>;
  let effects: PredicatesEffects;
  let adminService: AdminService;
  const initialState = initialPredicateState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        PredicatesEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getPredicates: () => of(predicates),
            getNextAvailableNum: () => of(2),
            getPredicate: () => of(predicates[0]),
            savePredicate: () => of('')
          }
        }
      ]
    });

    effects = TestBed.inject(PredicatesEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('loadPredicates$', () => {
    it('should set predicates get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getPredicates');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: PredicatesActions.loadPredicates()
      });

      const expected$ = hot('--a-', {
        a: PredicatesActions.loadPredicatesSuccess({ datas: predicates })
      });
      expect(effects.loadPredicates$).toBeObservable(expected$);
      expect(effects.loadPredicates$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadPredicates failure', () => {
      const getSpy = jest.spyOn(adminService, 'getPredicates').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: PredicatesActions.loadPredicates()
      });

      const expected$ = hot('--a-', {
        a: PredicatesActions.loadPredicatesFailure({ error: new Error('error') })
      });
      expect(effects.loadPredicates$).toBeObservable(expected$);
      expect(effects.loadPredicates$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('savePredicate$', () => {
    it('should call savePredicateSuccess', () => {
      const getSpy = jest.spyOn(adminService, 'savePredicate');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: PredicatesActions.savePredicate({ predicate: predicates[0], route: routeToPred })
      });

      const expected$ = hot('--a-', {
        a: PredicatesActions.savePredicateSuccess({ route: routeToPred })
      });
      expect(effects.savePredicate$).toBeObservable(expected$);
      expect(effects.savePredicate$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call savepredicate failure', () => {
      const getSpy = jest.spyOn(adminService, 'savePredicate').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: PredicatesActions.savePredicate({ predicate: predicates[0], route: routeToPred })
      });

      const expected$ = hot('--a-', {
        a: PredicatesActions.savePredicateFailure({ error: new Error('error') })
      });
      expect(effects.savePredicate$).toBeObservable(expected$);
      expect(effects.savePredicate$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('savePredicateSucess$', () => {
    it('should route to load Predicate', () => {
      actions$ = hot('--a-', {
        a: PredicatesActions.savePredicateSuccess({ route: routeToPred })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: routeToPred })
      });
      expect(effects.savePredicateSuccess$).toBeObservable(expected$);
    });
  });
  describe('selectPredicates$', () => {
    it('should set current predicate get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getPredicate');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: PredicatesActions.selectPredicate({ id: '1' })
      });

      const expected$ = hot('--a-', {
        a: PredicatesActions.selectPredicateSuccess({ data: predicates[0] })
      });
      expect(effects.selectPredicate$).toBeObservable(expected$);
      expect(effects.selectPredicate$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call selectPredicate failure', () => {
      const getSpy = jest.spyOn(adminService, 'getPredicate').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: PredicatesActions.selectPredicate({ id: '1' })
      });

      const expected$ = hot('--a-', {
        a: PredicatesActions.selectPredicateFailure({ error: new Error('error') })
      });
      expect(effects.selectPredicate$).toBeObservable(expected$);
      expect(effects.selectPredicate$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
