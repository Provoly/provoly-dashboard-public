import { createAction, props } from '@ngrx/store';
import { Class } from './class.interface';
import { DatasetCount } from '../../model/dataset.interface';

export const ClassActions = {
  load: createAction('[Class] Load Classes'),
  loadSuccess: createAction('[Class Api] (bus) Load Classes Success', props<{ classes: Class[] }>()),
  loadFailure: createAction('[Class Api] Load Classes Failure', props<{ error: string }>()),
  loadDatasetCount: createAction('[Class Api] Load DatasetCount'),
  loadDatasetCountSuccess: createAction(
    '[Class Api] Load DatasetCount Success',
    props<{
      datasetCounts: DatasetCount[];
    }>()
  ),
  loadDatasetCountFailure: createAction(
    '[Class Api] Load DatasetCount Failure',
    props<{
      error: any;
    }>()
  )
};
