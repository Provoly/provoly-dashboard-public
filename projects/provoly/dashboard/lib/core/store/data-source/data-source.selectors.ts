import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from '../search/search.constants';
import { DatasetVersion, DataSource } from './data-source.model';
import { dataSourceFeatureKey, DataSourceState } from './data-source.reducer';
import { NamedQueryUtils } from './named-query-utils';

const selectFeature = createFeatureSelector<DataSourceState>(dataSourceFeatureKey);

const getNamedQuery = createSelector(selectFeature, (state) => state);
const getAllNamedQuery = createSelector(selectFeature, (state) => state.list);
const getNamedQuerySorted = createSelector(selectFeature, (state) => {
  const list = [...state.list]
    .filter((nq) => nq.id !== DEFAULT_NAMED_QUERY_ID && nq.id !== EXPLORE_NAMED_QUERY_ID)
    .sort((a, b) => {
      const pastDate = new Date(1);
      const dateA = a.lastExecutionDate ? new Date(a.lastExecutionDate) : pastDate;
      const dateB = b.lastExecutionDate ? new Date(b.lastExecutionDate) : pastDate;
      return dateB.getTime() - dateA.getTime();
    })
    .sort((a, b) => Number(b.favorite) - Number(a.favorite));
  return list.length > 9 ? list.slice(0, 10) : list;
});
const editInProgress = createSelector(selectFeature, (state) => !!state.currentEdit);
const currentEditType = createSelector(selectFeature, (state) =>
  NamedQueryUtils.getTypeFromPayload(state.currentEdit?.request)
);
const currentEdit = createSelector(selectFeature, (state) => state.currentEdit);
const isRename = createSelector(selectFeature, (state) => state.isRename);
const editFromWidget = createSelector(selectFeature, (state) => state.fromWidget);
const datasets = createSelector(selectFeature, (state) => state.datasets);
const errors = createSelector(selectFeature, (state) => state.error);
const isLoading = createSelector(selectFeature, (state) => state.isLoading);
const getDataSources = createSelector(getAllNamedQuery, datasets, (nqs, dsd) => [...nqs, ...dsd] as DataSource[]);
const getDataSourcesSorted = createSelector(
  getAllNamedQuery,
  datasets,
  (nqs, dsd) =>
    [...nqs, ...dsd].sort((nq1, nq2) => nq1.name.toLowerCase().localeCompare(nq2.name.toLowerCase())) as DataSource[]
);
const selectedDatasetId = createSelector(selectFeature, (state) => state?.selectedDataset?.id);
const selectedDataset = createSelector(selectFeature, (state) => state?.selectedDataset);
const selectedDatasetMetadata = createSelector(selectFeature, (state) => state?.selectedDataset?.metadata ?? []);
const datasetVersions = createSelector(selectFeature, (state) => state?.datasetVersions ?? []);
const memoizeDatasetVersions = {} as any;
const matchingDatasetVersions = (datasetId: string) => {
  if (!memoizeDatasetVersions[datasetId]) {
    memoizeDatasetVersions[datasetId] = createSelector(datasetVersions, (datasetVersions) => {
      return datasetVersions.filter((datasetVersion: DatasetVersion) => datasetVersion.dataset === datasetId);
    });
  }

  return memoizeDatasetVersions[datasetId] as MemoizedSelector<any, DatasetVersion[]>;
};
const datasetPreviews = createSelector(selectFeature, (state) => state?.previews ?? []);

export const DataSourceSelectors = {
  selectFeature,
  getNamedQuery,
  getAllNamedQuery,
  getNamedQuerySorted,
  editInProgress,
  currentEditType,
  currentEdit,
  isRename,
  editFromWidget,
  datasets,
  errors,
  isLoading,
  getDataSources,
  getDataSourcesSorted,
  selectedDataset,
  selectedDatasetMetadata,
  datasetVersions,
  selectedDatasetId,
  matchingDatasetVersions,
  datasetPreviews
};
