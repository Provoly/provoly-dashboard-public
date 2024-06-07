import { createAction, props } from '@ngrx/store';
import { Category, Dataset, MissingGroupsByEntity } from '@provoly/dashboard';

export const AdminDatasetActions = {
  failure: createAction('[Dataset] Failure effect Dataset', props<{ error: any }>()),
  create: createAction('[Dataset] Create Dataset', props<{ dataset: Dataset; route: string }>()),
  update: createAction('[Dataset] Update Dataset', props<{ dataset: Dataset; route?: string }>()),
  confirmDatasetDeletion: createAction(
    '[Dataset] Confirm deletion',
    props<{ name: string; route: string; addRoute: string }>()
  ),
  delete: createAction('[Dataset] Delete Dataset', props<{ name: string; route: string; addRoute: string }>()),
  deleted: createAction('[Dataset] Dataset is deleted call to admin', props<{ addRoute: string }>()),

  selectDataset: createAction('[Dataset] Open Dataset details', props<{ dataset: Dataset }>()),
  unselectDataset: createAction('[Dataset] Unselect Dataset'),
  getDatasetById: createAction('[Dataset] Get Dataset by ID', props<{ id: string }>()),
  getDatasetByIdSuccess: createAction('[Dataset] Get Dataset by Id Success', props<{ data: Dataset }>()),
  getDatasetByIdFailure: createAction('[Dataset] Get Dataset by Id Failure', props<{ error: any }>()),
  openNewDataset: createAction('[Dataset] Open New Dataset', props<{ route: string }>()),
  setMissingGroups: createAction('[Dataset] Set Missing Groups', props<{ missingGroups?: MissingGroupsByEntity }>()),
  getCategories: createAction('[Dataset] Get Categories'),
  getCategoriesSuccess: createAction('[Dataset] Get Categories Success', props<{ categories: Category[] }>()),
  addCategory: createAction('[Dataset] Add Category', props<{ category: Category }>())
};
