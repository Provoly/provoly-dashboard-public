import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MultiClassCondition } from '@provoly/dashboard';
import * as fromSearchMultiClass from './search-multi-class.reducer';
import { SearchMultiClassState } from './search-multi-class.reducer';

const feature = createFeatureSelector<fromSearchMultiClass.SearchMultiClassState>(
  fromSearchMultiClass.searchMultiClassFeatureKey
);

const multiType = createSelector(feature, (state: SearchMultiClassState) => state?.multiType);
const conditions = createSelector(feature, (state: SearchMultiClassState) => state?.conditions);
const getConditionById = (id: string) =>
  createSelector(conditions, (conditions: MultiClassCondition[]) => conditions?.find((c) => c.id === id));

// in case when user could choose classes before fields

const searchMultiClassValid = createSelector(conditions, (conditions: MultiClassCondition[]) => {
  return (
    conditions.find((condition: MultiClassCondition) => {
      if (condition.field === undefined) {
        return true;
      }
      if ((condition.value ?? '') === '') {
        return true;
      }
      if (condition.pattern) {
        const pattern = condition.pattern;
        const value = condition.value as string;
        const patternTest = RegExp(pattern).test(value);
        return !patternTest;
      }
      return false;
    }) === undefined
  );
});

export const SearchMultiClassSelectors = {
  feature,
  multiType,
  conditions,
  getConditionById,
  searchMultiClassValid
};
