import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import * as fromMetadata from './metadata.reducer';

const feature = createFeatureSelector<fromMetadata.MetadataState>(fromMetadata.metadataFeatureKey);

const metadata = createSelector(feature, (state) => state?.metadata);
const loading = createSelector(feature, (state) => state?.loading);
const selectedMetadata = createSelector(
  feature,
  (state) => (state?.metadata.find((x) => x.id === state.selectedMetadata) as IMetadata) || null
);
const selectedMetadataId = createSelector(selectedMetadata, (metadata) => metadata?.id);
const selectMetadataById = (id: string) =>
  createSelector(metadata, (metadata: IMetadata[]) => metadata?.find((m) => m.id === id));

const editable = createSelector(feature, (state) => state.editable);

export const MetadataSelectors = {
  feature,
  loading,
  metadata,
  selectedMetadata,
  selectedMetadataId,
  selectMetadataById,
  editable
};
