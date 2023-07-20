import { createAction, props } from '@ngrx/store';
import { DatasetMetadata } from '@provoly/dashboard';

export const AdminDatasetActions = {
  isEditable: createAction(`[Admin/Datasource] Is editable`, props<{ editable: boolean }>()),

  loadDatasetMetadata: createAction(
    `[Admin/Datasource] Load Metadata of selected Datasets`,
    props<{ datasetId: string }>()
  ),
  loadDatasetMetadataSuccess: createAction(
    `[Admin/Datasource] Load Metadata of selected Datasets Success`,
    props<{ metadata: DatasetMetadata[] }>()
  ),
  loadDatasetMetadataFailure: createAction(
    `[Admin/Datasource] Load Metadata of selected Datasets Failure`,
    props<{ error: any }>()
  ),

  addDatasetMetadata: createAction(
    `[Admin/Datasource] Add Metadata of selected Datasets`,
    props<{ datasetId: string; metadataId: string; value: any }>()
  ),
  addDatasetMetadataSuccess: createAction(
    `[Admin/Datasource] Add Metadata of selected Datasets Success`,
    props<{ datasetId: string }>()
  ),
  addDatasetMetadataFailure: createAction(
    `[Admin/Datasource] Add Metadata of selected Datasets Failure`,
    props<{ error: any }>()
  ),

  deleteDatasetMetadata: createAction(
    `[Admin/Datasource] Delete Metadata of selected Datasets`,
    props<{ datasetId: string; metadataId: string }>()
  ),
  deleteDatasetMetadataSuccess: createAction(
    `[Admin/Datasource] Delete Metadata of selected Datasets Success`,
    props<{ datasetId: string }>()
  ),
  deleteDatasetMetadataFailure: createAction(
    `[Admin/Datasource] Delete Metadata of selected Datasets Failure`,
    props<{ error: any }>()
  )
};
