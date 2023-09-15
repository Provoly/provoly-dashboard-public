import { createReducer, on } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { MetadataActions } from './metadata.action';

export const metadataFeatureKey = '@pry/metadata';

export interface MetadataState {
  metadata: IMetadata[];
  selectedMetadata: string | null;
  loading: boolean;
  errors: any;
  editable: boolean;
}

export const initialMetadataState: MetadataState = {
  metadata: [],
  selectedMetadata: null,
  loading: false,
  errors: null,
  editable: false
};

/**
 * @TODO merge this store with admin user store ?
 */
export const metadataReducer = createReducer(
  initialMetadataState,
  on(MetadataActions.loadMetadataSuccess, (state, action) => ({
    ...state,
    metadata: [...action.metadata],
    loading: false
  })),
  on(
    MetadataActions.loadMetadataFailure,
    MetadataActions.goToNewMetadataFailure,
    MetadataActions.createMetadataFailure,
    MetadataActions.goToDetailsViewFailure,
    (state, action) => ({
      ...state,
      loading: false,
      errors: action.error
    })
  ),
  on(MetadataActions.unselectMetadata, (state) => ({
    ...state,
    selectedMetadata: null
  })),
  on(MetadataActions.loadMetadata, MetadataActions.goToNewMetadata, (state) => ({
    ...state,
    loading: true
  })),
  on(MetadataActions.createMetadataSuccess, (state, action) => ({
    ...state,
    metadata: [...state.metadata, action.metadata],
    loading: false
  })),
  on(MetadataActions.goToDetailsView, (state, action) => ({
    ...state,
    selectedMetadata: action.id
  })),
  on(MetadataActions.isEditable, (state, action) => ({
    ...state,
    editable: action.editable
  }))
);
