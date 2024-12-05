import { createAction, props } from '@ngrx/store';
import { RelationType } from './relation-types.interface';

export const RelationTypesActions = {
  load: createAction('[Relation Types] (bus) Load Relation Types', props<{ force?: boolean }>()),
  loadSuccess: createAction(
    '[Relation Types Api] (bus) Load Relation Types Success',
    props<{ datas: RelationType[] }>()
  ),
  loadFailure: createAction('[Relation Types Api] (bus) Load Relation Types Failure', props<{ error: any }>()),

  saveRelationType: createAction('[Relation Types] Save Relation Types', props<{ id: string; name: string }>()),
  saveRelationTypeSuccess: createAction('[Relation Types Api] Save Relation Types Success'),
  saveRelationTypeFailure: createAction('[Relation Types Api] Save Relation Types Failure', props<{ error: any }>()),

  selectRelationType: createAction('[Relation Types] Select Relation Type', props<{ id: string }>()),
  unSelectRelationType: createAction('[Relation Types] UnSelect Relation Type'),

  deleteRelationType: createAction('[Relation Types] Delete Relation Types', props<{ relationType: RelationType }>()),
  deleteRelationTypeSuccess: createAction('[Relation Types Api] Delete Relation Types Success'),
  deleteRelationTypeFailure: createAction(
    '[Relation Types Api] Delete Relation Types Failure',
    props<{ error: any }>()
  ),

  createRelation: createAction(
    '[Relation Types Api] Create Relation',
    props<{ from: string[]; to: string; typeId: string; inversion: boolean }>()
  ),
  deleteRelation: createAction(
    '[Relation Types Api] Delete Relation',
    props<{ from: string; to: string; typeId: string }>()
  ),
  createRelationSuccess: createAction('[Relation Types Api] Create Relation success'),
  createRelationFailure: createAction('[Relation Types Api] Create Relation failure', props<{ error: any }>()),

  openModal: createAction('[Relation Types] Open modal'),
  closeModal: createAction('[Relation Types] Close modal'),

  openDeleteModale: createAction('[Relation Types] Open delete modal'),
  closeDeleteModale: createAction('[Relation Types] Close delete modal')
};
