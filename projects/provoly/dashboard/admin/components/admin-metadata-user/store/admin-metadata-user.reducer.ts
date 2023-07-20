import { createReducer, on } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { AdminMetadataUserActions } from './admin-metadata-user.action';

export const adminMetadataUserFeatureKey = '@pry/admin/metadata/user';

export interface AdminMetadataUserState {
  metadata: Array<IMetadata>;
  selectedMetadata: string | null;
  loading: boolean;
  editable: boolean;
  errors: any;
}

export const initialAdminUserState: AdminMetadataUserState = {
  metadata: [],
  selectedMetadata: null,
  loading: false,
  editable: false,
  errors: null
};

export const adminMetadataUserReducer = createReducer(
  initialAdminUserState,
  on(AdminMetadataUserActions.loadMetadataSuccess, (state, action) => ({
    ...state,
    metadata: [...action.metadata],
    loading: false
  })),
  on(
    AdminMetadataUserActions.loadMetadataFailure,
    AdminMetadataUserActions.createMetadataFailure,
    AdminMetadataUserActions.updateMetadataFailure,
    (state, action) => ({
      ...state,
      loading: false,
      errors: action.error
    })
  ),
  on(AdminMetadataUserActions.selectMetadata, (state, action) => ({
    ...state,
    selectedMetadata: action.id
  })),
  on(AdminMetadataUserActions.unselectMetadata, (state) => ({
    ...state,
    selectedMetadata: null
  })),
  on(AdminMetadataUserActions.loadMetadata, AdminMetadataUserActions.updateMetadata, (state) => ({
    ...state,
    loading: true
  })),
  on(AdminMetadataUserActions.createMetadataSuccess, (state, action) => ({
    ...state,
    metadata: [...state.metadata, action.metadata],
    loading: false
  })),
  on(AdminMetadataUserActions.goToDetailsViewMetadata, (state, action) => ({
    ...state,
    selectedMetadata: action.id,
    editable: false
  })),
  on(AdminMetadataUserActions.goToEditMetadata, (state, action) => ({
    ...state,
    selectedMetadata: action.id,
    editable: true
  })),
  on(AdminMetadataUserActions.updateMetadataSuccess, (state, action) => ({
    ...state,
    metadata: [...state.metadata.map((old) => (old.id === action.metadata.id ? action.metadata : old))],
    loading: false
  }))
);
