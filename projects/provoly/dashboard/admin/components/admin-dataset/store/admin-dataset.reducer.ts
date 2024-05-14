import { Dataset, MissingGroupsByEntity } from '@provoly/dashboard';
import { createReducer, on } from '@ngrx/store';
import { AdminDatasetActions } from './admin-dataset.actions';

export const datasetFeatureKey = '@pry/admin/datasets';

export interface AdminDatasetState {
  isLoading: boolean;
  error?: Error;
  selectedDataset: Dataset | null;
  missingGroups?: MissingGroupsByEntity;
}

export const initialDatasetState: AdminDatasetState = {
  isLoading: false,
  selectedDataset: null
};

export const datasetReducer = createReducer(
  initialDatasetState,
  on(AdminDatasetActions.getDatasetById, (state, action) => ({
    ...state,
    loading: true
  })),
  on(AdminDatasetActions.getDatasetByIdSuccess, (state, action) => ({
    ...state,
    selectedDataset: action.data,
    loading: false
  })),
  on(AdminDatasetActions.getDatasetByIdFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false
  })),
  on(AdminDatasetActions.setMissingGroups, (state, { missingGroups }) => ({
    ...state,
    missingGroups
  })),
  on(AdminDatasetActions.unselectDataset, (state) => ({
    ...state,
    selectedDataset: null
  })),
  on(AdminDatasetActions.selectDataset, (state, action) => ({
    ...state,
    selectedDataset: action.dataset
  }))
);
