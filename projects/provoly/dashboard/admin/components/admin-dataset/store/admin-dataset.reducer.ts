import { createReducer, on } from '@ngrx/store';
import { AdminDatasetActions } from './admin-dataset.actions';

export const adminDatasetFeatureKey = '@pry/admin/dataset';

export interface AdminDatasetState {
  editable: boolean;
}

export const initialAdminDatasetState: AdminDatasetState = {
  editable: false
};

export const adminDatasetReducer = createReducer(
  initialAdminDatasetState,
  on(AdminDatasetActions.isEditable, (state, action) => ({
    ...state,
    editable: action.editable
  }))
);
