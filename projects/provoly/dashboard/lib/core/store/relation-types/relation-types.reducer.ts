import { createReducer, on } from '@ngrx/store';
import { RelationTypesActions } from './relation-types.actions';
import { RelationType } from './relation-types.interface';

export const relationTypesFeatureKey = '@pry/relation-types';

export interface RelationTypeState {
  relationsTypes: RelationType[];
  selectedRelationType?: RelationType;
  loading: boolean;
  openModal: boolean;
  openDeleteModale: boolean;
}

export const initialRelationTypeState: RelationTypeState = {
  relationsTypes: [],
  loading: false,
  openModal: false,
  openDeleteModale: false
};

export const relationTypeReducer = createReducer(
  initialRelationTypeState,
  on(RelationTypesActions.load, (state, action) => ({
    ...state,
    loading: true
  })),
  on(RelationTypesActions.loadSuccess, (state, action) => ({
    ...state,
    relationsTypes: [...action.datas],
    loading: false
  })),
  on(RelationTypesActions.loadFailure, (state, action) => ({
    ...state,
    loading: false
  })),
  on(RelationTypesActions.selectRelationType, (state, action) => ({
    ...state,
    selectedRelationType: state.relationsTypes.find((rt) => rt.id === action.id)
  })),
  on(RelationTypesActions.unSelectRelationType, (state, action) => ({
    ...state,
    selectedRelationType: undefined
  })),
  on(RelationTypesActions.openModal, (state, action) => ({
    ...state,
    openModal: true
  })),
  on(RelationTypesActions.closeModal, (state, action) => ({
    ...state,
    openModal: false
  }))
);
