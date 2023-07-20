import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import * as fromAdminUser from './admin-metadata-user.reducer';

const feature = createFeatureSelector<fromAdminUser.AdminMetadataUserState>(fromAdminUser.adminMetadataUserFeatureKey);

const metadata = createSelector(feature, (state) => state?.metadata);
const loading = createSelector(feature, (state) => state?.loading);
const selectedMetadata = createSelector(
  feature,
  (state) => (state?.metadata.find((x) => x.id === state.selectedMetadata) as IMetadata) || null
);
const selectedMetadataId = createSelector(selectedMetadata, (metadata) => metadata?.id);
const editable = createSelector(feature, (state) => ({ value: state?.editable }));

export const AdminMetadataUserSelectors = {
  feature,
  loading,
  metadata,
  selectedMetadata,
  selectedMetadataId,
  editable
};
