import { createReducer, on } from '@ngrx/store';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { SearchActions } from './search.actions';
import { DEFAULT_NAMED_QUERY_ID } from './search.constants';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { Filter } from '../../model/filter.interface';

export const searchFeatureKey = '@pry/search';

export interface SearchState {
  searchLoading: string[];
  payload?: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload;
  id?: string;
  possibleFilterValues: { [key: string]: string[]}
}

export const initialSearchState: SearchState = {
  searchLoading: [],
  payload: undefined,
  id: undefined,
  possibleFilterValues: {}
};

export const searchReducer = createReducer(
  initialSearchState,
  on(SearchActions.search, (state, action) => ({
    ...state,
    searchLoading: [...new Set([...state.searchLoading, action.id ?? DEFAULT_NAMED_QUERY_ID])],
    payload: action.payload,
    id: action.id
  })),
  on(SearchActions.getDatasourceItems, (state, action) => ({
    ...state,
    searchLoading: [...new Set([...state.searchLoading, action.id])]
  })),
  on(SearchActions.searchSuccess, (state, action) => ({
    ...state,
    searchLoading: [...state.searchLoading.filter((id) => id !== (action.id ?? DEFAULT_NAMED_QUERY_ID))]
  })),
  on(SearchActions.searchFailure, (state, action) => ({
    ...state,
    searchLoading: [...state.searchLoading.filter((id) => id !== (action.id ?? DEFAULT_NAMED_QUERY_ID))]
  })),
  on(SearchActions.setSearchLoading, (state, action) => ({
    ...state,
    searchLoading: action.start
      ? [...new Set([...state.searchLoading, ...action.datasources])]
      : [...state.searchLoading.filter((id) => !action.datasources.includes(id))]
  })),
  on(SearchActions.setPossibleFilterValues, (state, { filterId, values }) => ({
    ...state,
    possibleFilterValues: {
      ...state.possibleFilterValues,
      [filterId]: values
    }
  }))
);
