import { createReducer, on } from '@ngrx/store';
import { DatasetPreview } from '../../model/dataset.interface';
import { DataSourceActions } from './data-source.actions';
import { Dataset, DatasetVersion, NamedQuery } from './data-source.model';
import { Category } from '../category/category.interface';

export const dataSourceFeatureKey = '@pry/datasources';

export interface DataSourceState {
  isLoading: boolean;
  list: NamedQuery[];
  currentEdit?: NamedQuery;
  fromWidget?: { widgetIndex: number; editedQuery: string };
  isRename: boolean;
  datasets: Dataset[];
  error?: Error;
  datasetVersions: DatasetVersion[];
  totalVersionCount: number; // for pagination
  selectedDatasetVersion: DatasetVersion | null;
  previews: DatasetPreview[];
  categories: Category[];
}

export const initialDataSourceState: DataSourceState = {
  isLoading: false,
  list: [],
  isRename: false,
  datasets: [],
  datasetVersions: [],
  totalVersionCount: 0,
  selectedDatasetVersion: null,
  previews: [],
  categories: []
};

export const dataSourceReducer = createReducer(
  initialDataSourceState,
  on(DataSourceActions.namedQuery.load, (state) => ({ ...state, error: undefined, isLoading: true })),
  on(DataSourceActions.namedQuery.loaded, (state, action) => ({ ...state, list: action.list, isLoading: false })),
  on(DataSourceActions.namedQuery.delete, (state) => ({ ...state, error: undefined, isLoading: false })),
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
  on(DataSourceActions.dataset.failure, (state, action) => ({
    ...state,
    error: action.error,
    isLoading: false
  })),
  on(DataSourceActions.dataset.listVersions, (state) => ({
    ...state,
    loading: true
  })),
  on(DataSourceActions.dataset.listVersionsSuccess, (state, action) => ({
    ...state,
    loading: false,
    datasetVersions: action.versions,
    totalVersionCount: action.totalVersionCount
  })),
  on(DataSourceActions.dataset.listVersionsFailure, (state) => ({
    ...state,
    loading: false
  })),
  on(DataSourceActions.dataset.selectedDatasetVersion, (state, action) => ({
    ...state,
    matchingDatasetVersions: action.version
  })),
  on(DataSourceActions.dataset.deactivateDatasetVersion, (state) => ({
    ...state,
    loading: true
  })),
  on(DataSourceActions.dataset.deactivateDatasetVersionSuccess, (state, action) => ({
    ...state,
    loading: false,
    datasetVersion: action.datasetVersion
  })),
  on(DataSourceActions.dataset.deactivateDatasetVersionFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false
  })),
  on(DataSourceActions.dataset.activateDatasetVersion, (state) => ({
    ...state,
    loading: true
  })),
  on(DataSourceActions.dataset.activateDatasetVersionSuccess, (state, action) => ({
    ...state,
    loading: false,
    datasetVersion: action.datasetVersion
  })),
  on(DataSourceActions.dataset.activateDatasetVersionFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false
  })),
  on(DataSourceActions.dataset.updateVersionList, (state, action) => ({
    ...state,
    datasetVersions: action.versions
  })),
  on(DataSourceActions.dataset.previews.getById, (state) => ({
    ...state,
    loading: true
  })),
  on(DataSourceActions.dataset.previews.getByIdSuccess, (state, action) => ({
    ...state,
    previews: action.previews,
    loading: false
  })),
  on(DataSourceActions.dataset.previews.getByIdFailure, (state, action) => ({
    ...state,
    error: action.error,
    previews: [],
    loading: false
  })),
  on(DataSourceActions.dataset.updateDatasetVersionInfoSuccess, (state, action) => ({
    ...state,
    datasetVersions: state.datasetVersions.map((version) =>
      version.id === action.version.id ? { ...version, ...action.version } : version
    )
  })),
  on(DataSourceActions.dataset.getCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories
  }))
);
