import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminDatasetState, datasetFeatureKey } from './admin-dataset.reducer';

const selectFeature = createFeatureSelector<AdminDatasetState>(datasetFeatureKey);

const errors = createSelector(selectFeature, (state) => state.error);
const isLoading = createSelector(selectFeature, (state) => state.isLoading);
const selectedDatasetId = createSelector(selectFeature, (state) => state?.selectedDataset?.id);
const selectedDataset = createSelector(selectFeature, (state) => state?.selectedDataset);
const selectedDatasetMetadata = createSelector(selectFeature, (state) => state?.selectedDataset?.metadata ?? []);
const selectedDatasetMissingGroups = createSelector(selectFeature, (state) => state?.missingGroups);

export const AdminDatasetSelectors = {
  selectFeature,
  errors,
  isLoading,
  selectedDataset,
  selectedDatasetMetadata,
  selectedDatasetMissingGroups,
  selectedDatasetId
};
