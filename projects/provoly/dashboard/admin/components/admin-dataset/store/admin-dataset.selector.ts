import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAdminDataset from './admin-dataset.reducer';

const feature = createFeatureSelector<fromAdminDataset.AdminDatasetState>(fromAdminDataset.adminDatasetFeatureKey);
const editable = createSelector(feature, (state) => state.editable);

export const AdminDatasetSelectors = {
  feature,
  editable
};
