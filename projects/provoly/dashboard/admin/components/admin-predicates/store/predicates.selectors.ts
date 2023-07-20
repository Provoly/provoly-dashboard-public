import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPredicates from './predicates.reducer';

const feature = createFeatureSelector<fromPredicates.PredicateState>(fromPredicates.predicatesFeatureKey);

const predicates = createSelector(feature, (state) => state?.predicates);
const loading = createSelector(feature, (state) => state?.loading);
const currentPredicate = createSelector(feature, (state) => state?.currentPredicate);
const currentPredicateId = createSelector(currentPredicate, (pred) => pred?.id);

export const PredicatesSelectors = {
  feature,
  predicates,
  loading,
  currentPredicate,
  currentPredicateId
};
