import { createReducer, on } from '@ngrx/store';
import { Dataset, DatasetError } from '../../model/dataset.interface';
import { DataSourceActions } from './data-source.actions';
import { DatasetVersion, NamedQuery } from './data-source.model';

export const dataSourceFeatureKey = '@pry/datasources';

export interface DataSourceState {
  isLoading: boolean;
  list: NamedQuery[];
  currentEdit?: NamedQuery;
  fromWidget?: { widgetIndex: number; editedQuery: string };
  isRename: boolean;
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  error?: Error;
  datasetVersions: DatasetVersion[];
  selectedDatasetVersion: DatasetVersion | null;
  errors: DatasetError[];
}

export const initialDataSourceState: DataSourceState = {
  isLoading: false,
  list: [],
  isRename: false,
  selectedDataset: null,
  datasets: [],
  datasetVersions: [],
  selectedDatasetVersion: null,
  errors: []
};

export const dataSourceReducer = createReducer(
  initialDataSourceState,
  on(DataSourceActions.namedQuery.load, (state) => ({ ...state, error: undefined, isLoading: true })),
  on(DataSourceActions.namedQuery.loaded, (state, action) => ({ ...state, list: action.list, isLoading: false })),
  on(DataSourceActions.namedQuery.delete, (state, action) => ({ ...state, error: undefined, isLoading: false })),
  on(DataSourceActions.namedQuery.failure, (state, action) => ({ ...state, error: action.error, isLoading: false })),
  on(DataSourceActions.namedQuery.openEdit, (state, action) => ({
    ...state,
    isLoading: false,
    currentEdit: action.currentEdit,
    fromWidget:
      action.widgetIndex !== undefined
        ? {
            widgetIndex: action.widgetIndex,
            editedQuery: action.currentEdit.id
          }
        : undefined
  })),
  on(DataSourceActions.namedQuery.stopEdit, (state) => ({
    ...state,
    currentEdit: undefined,
    fromWidget: undefined,
    isLoading: false
  })),
  on(DataSourceActions.namedQuery.updateCurrentEdit, (state, action) => ({
    ...state,
    // @ts-ignore
    currentEdit: {
      ...state.currentEdit,
      ...action.currentEdit
    }
  })),
  on(DataSourceActions.namedQuery.openRename, (state) => ({ ...state, isRename: true })),
  on(DataSourceActions.namedQuery.stopRename, (state) => ({ ...state, isRename: false })),
  on(DataSourceActions.dataset.loadDataset, (state) => ({ ...state, error: undefined, isLoading: true })),
  on(DataSourceActions.dataset.loadedDataset, (state, action) => ({
    ...state,
    datasets: action.datasets,
    isLoading: false
  })),
  on(DataSourceActions.dataset.unselectDataset, (state) => ({
    ...state,
    selectedDataset: null
  })),
  on(DataSourceActions.dataset.selectDataset, (state, action) => ({
    ...state,
    selectedDataset: action.dataset
  })),
  on(DataSourceActions.dataset.failure, (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false
  })),
  on(DataSourceActions.dataset.getDatasetById, (state, action) => ({
    ...state,
    loading: true
  })),
  on(DataSourceActions.dataset.getDatasetByIdSuccess, (state, action) => ({
    ...state,
    selectedDataset: action.data,
    loading: false
  })),
  on(DataSourceActions.dataset.getDatasetByIdFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false
  })),
  on(DataSourceActions.dataset.listVersions, (state, action) => ({
    ...state,
    loading: true
  })),
  on(DataSourceActions.dataset.listVersionsSuccess, (state, action) => ({
    ...state,
    loading: false,
    datasetVersions: action.versions
  })),
  on(DataSourceActions.dataset.selectedDatasetVersion, (state, action) => ({
    ...state,
    matchingDatasetVersions: action.version
  })),
  on(DataSourceActions.dataset.listVersionsFailure, (state, action) => ({
    ...state,
    loading: false
  })),
  on(DataSourceActions.dataset.errors.getById, (state, action) => ({
    ...state,
    loading: true
  })),
  on(DataSourceActions.dataset.errors.getByIdSuccess, (state, action) => ({
    ...state,
    errors: action.errors,
    loading: false
  })),
  on(DataSourceActions.dataset.errors.getByIdFailure, (state, action) => ({
    ...state,
    error: action.error,
    errors: [],
    loading: false
  }))
);
