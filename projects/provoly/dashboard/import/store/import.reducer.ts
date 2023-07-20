import { createReducer, on } from '@ngrx/store';
import { ImportActions, ImportError } from './import.actions';

export const importFeatureKey = '@pry/import';

export interface ImportState {
  loading: boolean;
  errors: { [p: string]: ImportError[] } | null;
  numberOfLines: number;
}

export const initialImportState: ImportState = {
  loading: false,
  errors: null,
  numberOfLines: 0
};

export const importReducer = createReducer(
  initialImportState,
  on(ImportActions.upload, (state, action) => ({
    ...state,
    loading: true,
    numberOfLines: 0,
    errors: null
  })),
  on(ImportActions.uploadSuccess, (state, action) => ({
    ...state,
    loading: false,
    numberOfLines: action.numberOfLines
  })),
  on(ImportActions.uploadFailure, (state, action) => ({
    ...state,
    loading: false,
    errors: action.errors
  }))
);
