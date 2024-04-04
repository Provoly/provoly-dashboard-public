import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from './search.reducer';

const feature = createFeatureSelector<fromSearch.SearchState>(fromSearch.searchFeatureKey);

const searchLoading = createSelector(feature, (state) => state.searchLoading);
const possibleFilterValues = (filterId?: string) =>
  createSelector(feature, (state) =>
    filterId && state.possibleFilterValues[filterId] ? state.possibleFilterValues[filterId] : []
  );

export const SearchSelectors = {
  feature,
  searchLoading,
  possibleFilterValues
};
