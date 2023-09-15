import { createAction, props } from '@ngrx/store';
import { IMetadata, MetadataValue } from '@provoly/dashboard';

export const MetadataActions = {
  loadMetadata: createAction(`[Metadata] Load Metadata`),
  loadMetadataSuccess: createAction(`[Metadata] Load Metadata Success`, props<{ metadata: Array<IMetadata> }>()),
  loadMetadataFailure: createAction(`[Metadata] Load Metadata Failure`, props<{ error: any }>()),

  unselectMetadata: createAction(`[Metadata] unSelect Metadata`),

  goToNewMetadata: createAction(`[Metadata] go to new metadata`, props<{ route: string }>()),
  goToNewMetadataSuccess: createAction(`[Metadata] go to new metadata success`),
  goToNewMetadataFailure: createAction(`[Metadata] go to new metadata failure`, props<{ error: any }>()),

  createMetadata: createAction(`[Metadata] create metadata`, props<{ metadata: IMetadata }>()),
  createMetadataSuccess: createAction(`[Metadata] create metadata Success`, props<{ metadata: IMetadata }>()),
  createMetadataFailure: createAction(`[Metadata] create metadata Failure`, props<{ error: any }>()),

  goToDetailsView: createAction(`[Metadata] go to details view`, props<{ id: string }>()),
  goToDetailsViewSuccess: createAction(`[Metadata] go to details view success`, props<{ metadata: IMetadata }>()),
  goToDetailsViewFailure: createAction(`[Metadata] go to details view failure`, props<{ error: any }>()),

  addDatasetMetadata: createAction(
    `[Metadata] Add Metadata of selected Datasets`,
    props<{ datasetId: string; metadataId: string; value: any }>()
  ),
  addDatasetMetadataSuccess: createAction(
    `[Metadata] Add Metadata of selected Datasets Success`,
    props<{ datasetId: string }>()
  ),
  addDatasetMetadataFailure: createAction(
    `[Metadata] Add Metadata of selected Datasets Failure`,
    props<{ error: any }>()
  ),

  deleteDatasetMetadata: createAction(
    `[Metadata] Delete Metadata of selected Datasets`,
    props<{ datasetId: string; metadataId: string }>()
  ),
  deleteDatasetMetadataSuccess: createAction(
    `[Metadata] Delete Metadata of selected Datasets Success`,
    props<{ datasetId: string }>()
  ),
  deleteDatasetMetadataFailure: createAction(
    `[Metadata] Delete Metadata of selected Datasets Failure`,
    props<{ error: any }>()
  ),
  isEditable: createAction(`[Metadata] Is editable`, props<{ editable: boolean }>()),
  loadDatasetMetadata: createAction(`[Metadata] Load Metadata of selected Datasets`, props<{ datasetId: string }>()),
  loadDatasetMetadataSuccess: createAction(
    `[Metadata] Load Metadata of selected Datasets Success`,
    props<{ metadata: MetadataValue[] }>()
  ),
  loadDatasetMetadataFailure: createAction(
    `[Metadata] Load Metadata of selected Datasets Failure`,
    props<{ error: any }>()
  )
};
