import { createAction, props } from '@ngrx/store';
import { Dataset, MissingGroupsByEntity } from '@provoly/dashboard';

export const AdminDatasetActions = {
  failure: createAction('[Dataset] failure effect Dataset', props<{ error: any }>()),
  create: createAction('[Dataset] create Dataset', props<{ dataset: Dataset; route: string }>()),
  update: createAction('[Dataset] update Dataset', props<{ dataset: Dataset; route?: string }>()),
  confirmDatasetDeletion: createAction(
    '[Dataset] confirm deletion',
    props<{ name: string; route: string; addRoute: string }>()
  ),
  delete: createAction('[Dataset] delete Dataset', props<{ name: string; route: string; addRoute: string }>()),
  deleted: createAction('[Dataset] Dataset is deleted call to admin', props<{ addRoute: string }>()),

  selectDataset: createAction('[Dataset] open Dataset details', props<{ dataset: Dataset }>()),
  unselectDataset: createAction('[Dataset] unselect Dataset'),
  getDatasetById: createAction('[Dataset] Get Dataset by ID', props<{ id: string }>()),
  getDatasetByIdSuccess: createAction('[Dataset] Get Dataset by Id Success', props<{ data: Dataset }>()),
  getDatasetByIdFailure: createAction('[Dataset] Get Dataset by Id Failure', props<{ error: any }>()),
  openNewDataset: createAction('[Dataset] open new Dataset', props<{ route: string }>()),
  setMissingGroups: createAction('[Dataset] set missing groups', props<{ missingGroups?: MissingGroupsByEntity }>())
};
