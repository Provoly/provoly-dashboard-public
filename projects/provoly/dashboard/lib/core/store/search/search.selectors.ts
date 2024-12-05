import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from './search.reducer';

const feature = createFeatureSelector<fromSearch.SearchState>(fromSearch.searchFeatureKey);

const searchLoading = createSelector(feature, (state) => state.searchLoading);
const possibleFilterValues = (filterId?: string) =>
  createSelector(feature, (state) =>
    filterId && state.possibleFilterValues[filterId] ? state.possibleFilterValues[filterId] : []
  );
const filterValues = createSelector(feature, (state) => state.possibleFilterValues);

export const SearchSelectors = {
  feature,
  searchLoading,
  filterValues,
  possibleFilterValues
};
