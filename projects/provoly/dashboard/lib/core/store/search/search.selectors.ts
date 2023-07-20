import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from './search.reducer';

const feature = createFeatureSelector<fromSearch.SearchState>(fromSearch.searchFeatureKey);

const searchLoading = createSelector(feature, (state) => state.searchLoading);

export const SearchSelectors = {
  feature,
  searchLoading
};
