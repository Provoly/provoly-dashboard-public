import { createReducer, on } from '@ngrx/store';
import { AdminMetadataUserActions } from './admin-metadata-user.action';

export const adminMetadataUserFeatureKey = '@pry/admin/metadata/user';

export interface AdminMetadataUserState {
  loading: boolean;
  editable: boolean;
  errors: any;
  selectedMetadataId: string | null;
}

export const initialAdminUserState: AdminMetadataUserState = {
  loading: false,
  editable: false,
  errors: null,
  selectedMetadataId: null
};

export const adminMetadataUserReducer = createReducer(
  initialAdminUserState,
  on(AdminMetadataUserActions.selectMetadata, (state, action) => ({
    ...state,
    selectedMetadataId: action.id
  })),
  on(AdminMetadataUserActions.unselectMetadata, (state) => ({
    ...state,
    selectedMetadataId: null
  })),
  on(AdminMetadataUserActions.goToDetailsViewMetadata, (state, action) => ({
    ...state,
    selectedMetadataId: action.id,
    editable: false
  })),
  on(AdminMetadataUserActions.goToEditMetadata, (state, action) => ({
    ...state,
    selectedMetadataId: action.id,
    editable: true
  }))
);
