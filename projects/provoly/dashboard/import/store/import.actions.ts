import { createAction, props } from '@ngrx/store';
import { DatasetVersion } from '@provoly/dashboard';

export const ImportActions = {
  upload: createAction('[Import] import data', props<{ file: File; dataset: string; fileType: string }>()),
  uploadSuccess: createAction('[Import] import data successful', props<{ uploadedDataset: Partial<DatasetVersion> }>()),
  uploadFailure: createAction('[Import] import data failure', props<{ errors: any }>())
};
