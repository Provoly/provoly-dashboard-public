import { createReducer, on } from '@ngrx/store';
import { Image, ImageActions } from './image.actions';

export const imageFeatureKey = '@pry/image';

export interface ImageState {
  loading: boolean;
  list: Image[];
  lastAdded?: string;
}

export const initialImageState: ImageState = {
  loading: false,
  list: [],
  lastAdded: undefined
};

export const imageReducer = createReducer(
  initialImageState,
  on(ImageActions.load, (state) => ({
    ...state,
    loading: true
  })),
  on(ImageActions.loadSuccess, (state, action) => ({
    ...state,
    list: action.images,
    loading: false
  })),
  on(ImageActions.added, (state, action) => ({
    ...state,
    lastAdded: action.name
  })),
  on(ImageActions.clearAdded, (state, action) => ({
    ...state,
    lastAdded: undefined
  }))
);
