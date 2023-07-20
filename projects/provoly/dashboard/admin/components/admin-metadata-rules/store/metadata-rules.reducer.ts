import { createReducer, on } from '@ngrx/store';
import { MetadataRules } from '@provoly/dashboard';
import { AdminMetadataRulesActions } from './metadata-rules.actions';

export const adminMetadataRulesFeatureKey = '@pry/admin/metadata-rules';

export interface MetadataRulesState {
  loading: boolean;
  errors: any;
  list: MetadataRules[];
  metadataRulesSelected: MetadataRules | null;
  isNameAlreadyExist: boolean;
}

export const initialMetadataRulesState: MetadataRulesState = {
  loading: false,
  errors: null,
  list: [],
  metadataRulesSelected: null,
  isNameAlreadyExist: false
};

export const adminMetadataRulesReducer = createReducer(
  initialMetadataRulesState,
  on(AdminMetadataRulesActions.load, (state) => ({
    ...state,
    loading: true
  })),
  on(AdminMetadataRulesActions.loaded, (state, action) => ({
    ...state,
    list: action.list,
    loading: false
  })),
  on(AdminMetadataRulesActions.unselectMetadata, (state) => ({
    ...state,
    metadataRulesSelected: null
  })),
  on(AdminMetadataRulesActions.selectMetadata, (state, action) => ({
    ...state,
    metadataRulesSelected: action.metadataRules
  })),
  on(AdminMetadataRulesActions.failure, (state, action) => ({
    ...state,
    error: action.error
  }))
);
