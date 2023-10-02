import { createAction, props } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';

const BASE = '[Admin/User]';
const BASEAPI = '[Admin/User Api]';

export const AdminMetadataUserActions = {
  selectMetadata: createAction(`${BASE} Select Metadata`, props<{ id: string }>()),
  unselectMetadata: createAction(`${BASE} unSelect Metadata`),

  createMetadata: createAction(`${BASE} create metadata`, props<{ metadata: IMetadata }>()),
  createMetadataSuccess: createAction(`${BASEAPI} create metadata Success`, props<{ metadata: IMetadata }>()),
  createMetadataFailure: createAction(`${BASEAPI} create metadata Failure`, props<{ error: any }>()),

  goToDetailsViewMetadata: createAction(`${BASE} go to details view metadata`, props<{ id: string }>()),
  goToDetailsViewMetadataSuccess: createAction(
    `${BASEAPI} go to details view metadata success`,
    props<{ metadata: IMetadata }>()
  ),
  goToDetailsViewMetadataFailure: createAction(
    `${BASEAPI} go to details view metadata failure`,
    props<{ error: any }>()
  ),

  goToEditMetadata: createAction(`${BASE} go to edit view`, props<{ id: string; route: string }>()),
  goToEditMetadataSuccess: createAction(
    `${BASE} go to edit view success`,
    props<{ metadata: IMetadata; route: string }>()
  ),
  goToEditMetadataFailure: createAction(`${BASE} go to edit view failure`, props<{ error: any }>()),

  updateMetadata: createAction(`${BASE} update meta data`, props<{ metadata: IMetadata }>()),
  updateMetadataSuccess: createAction(`${BASEAPI} update meta data Success`, props<{ metadata: IMetadata }>()),
  updateMetadataFailure: createAction(`${BASEAPI} update meta data Failure`, props<{ error: any }>())
};
