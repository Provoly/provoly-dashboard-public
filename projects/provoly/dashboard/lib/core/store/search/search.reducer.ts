import { createReducer, on } from '@ngrx/store';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { SearchActions } from './search.actions';
import { DEFAULT_NAMED_QUERY_ID } from './search.constants';

export const searchFeatureKey = '@pry/search';

export interface SearchState {
  searchLoading: string[];
  payload?: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload;
  id?: string;
}

export const initialSearchState: SearchState = {
  searchLoading: [],
  payload: undefined,
  id: undefined
};

export const searchReducer = createReducer(
  initialSearchState,
  on(SearchActions.search, (state, action) => ({
    ...state,
    searchLoading: [...new Set([...state.searchLoading, DEFAULT_NAMED_QUERY_ID])],
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
  }))
);
