import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPipeline from './import.reducer';

const feature = createFeatureSelector<fromPipeline.ImportState>(fromPipeline.importFeatureKey);

const loading = createSelector(feature, (state) => state.loading);
const uploadedDataset = createSelector(feature, (state) => state?.uploadedDataset);

export const ImportSelectors = {
  loading,
  uploadedDataset
};
