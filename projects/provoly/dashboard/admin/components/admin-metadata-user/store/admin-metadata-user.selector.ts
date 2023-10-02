import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAdminUser from './admin-metadata-user.reducer';

const feature = createFeatureSelector<fromAdminUser.AdminMetadataUserState>(fromAdminUser.adminMetadataUserFeatureKey);
const loading = createSelector(feature, (state) => state?.loading);
const editable = createSelector(feature, (state) => ({ value: state?.editable }));
const selectedMetadataId = createSelector(feature, (state) => state?.selectedMetadataId);

export const AdminMetadataUserSelectors = {
  feature,
  loading,
  selectedMetadataId,
  editable
};
