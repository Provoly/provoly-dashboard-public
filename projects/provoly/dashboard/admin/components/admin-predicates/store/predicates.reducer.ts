import { createReducer, on } from '@ngrx/store';
import { Predicate } from '@provoly/dashboard';
import { PredicatesActions } from './predicates.actions';

export const predicatesFeatureKey = '@pry/admin/predicates';

export interface PredicateState {
  predicates: Predicate[];
  loading: boolean;
  currentPredicate?: Predicate;
}

export const initialPredicateState: PredicateState = {
  predicates: [],
  loading: false
};

export const predicateReducer = createReducer(
  initialPredicateState,
  on(PredicatesActions.loadPredicates, (state, action) => ({
    ...state,
    loading: true,
    currentPredicate: undefined,
    nextNum: undefined
  })),
  on(PredicatesActions.loadPredicatesSuccess, (state, action) => ({
    ...state,
    predicates: [...action.datas],
    loading: false
  })),
  on(PredicatesActions.loadPredicatesFailure, (state, action) => ({
    ...state,
    loading: false
  })),
  on(PredicatesActions.savePredicate, (state, action) => ({
    ...state,
    loading: true
  })),
  on(PredicatesActions.savePredicateSuccess, (state, action) => ({
    ...state,
    loading: false
  })),
  on(PredicatesActions.savePredicateFailure, (state, action) => ({
    ...state,
    loading: false
  })),

  on(PredicatesActions.selectPredicate, (state, action) => ({
    ...state,
    loading: true
  })),
  on(PredicatesActions.selectPredicateSuccess, (state, action) => ({
    ...state,
    currentPredicate: action.data,
    loading: false
  })),
  on(PredicatesActions.selectPredicateFailure, (state, action) => ({
    ...state,
    loading: false
  }))
);
