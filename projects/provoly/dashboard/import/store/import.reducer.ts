import { createReducer, on } from '@ngrx/store';
import { ImportActions } from './import.actions';
import { DatasetVersion } from '@provoly/dashboard';

export const importFeatureKey = '@pry/import';

export interface ImportState {
  loading: boolean;
  uploadedDataset?: Partial<DatasetVersion>;
}

export const initialImportState: ImportState = {
  loading: false
};

export const importReducer = createReducer(
  initialImportState,
  on(ImportActions.upload, (state) => ({
    ...state,
    loading: true
  })),
  on(ImportActions.uploadSuccess, (state, action) => ({
    ...state,
    loading: false,
    uploadedDataset: action.uploadedDataset
  }))
);
