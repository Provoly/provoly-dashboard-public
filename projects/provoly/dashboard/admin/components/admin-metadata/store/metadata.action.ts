import { createAction, props } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';

const BASE = '[Admin/Metadata]';
const BASEAPI = '[Admin/Metadata Api]';

export const MetadataActions = {
  loadMetadata: createAction(`${BASE} Load Metadata`),
  loadMetadataSuccess: createAction(`${BASEAPI} Load Metadata Success`, props<{ metadata: Array<IMetadata> }>()),
  loadMetadataFailure: createAction(`${BASEAPI} Load Metadata Failure`, props<{ error: any }>()),

  unselectMetadata: createAction(`${BASE} unSelect Metadata`),

  goToNewMetadata: createAction(`${BASE} go to new metadata`, props<{ route: string }>()),
  goToNewMetadataSuccess: createAction(`${BASEAPI} go to new metadata success`),
  goToNewMetadataFailure: createAction(`${BASEAPI} go to new metadata failure`, props<{ error: any }>()),

  createMetadata: createAction(`${BASE} create metadata`, props<{ metadata: IMetadata }>()),
  createMetadataSuccess: createAction(`${BASEAPI} create metadata Success`, props<{ metadata: IMetadata }>()),
  createMetadataFailure: createAction(`${BASEAPI} create metadata Failure`, props<{ error: any }>()),

  goToDetailsView: createAction(`${BASE} go to details view`, props<{ id: string }>()),
  goToDetailsViewSuccess: createAction(`${BASEAPI} go to details view success`, props<{ metadata: IMetadata }>()),
  goToDetailsViewFailure: createAction(`${BASEAPI} go to details view failure`, props<{ error: any }>())
};
