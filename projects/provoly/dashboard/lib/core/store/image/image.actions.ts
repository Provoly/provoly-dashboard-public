import { createAction, props } from '@ngrx/store';

export interface Image {
  image: string;
  type: string[];
}

export const ImageActions = {
  load: createAction('[Image] Load Images'),
  loadSuccess: createAction('[Image] Load Images Success', props<{ images: Image[] }>()),
  loadFailure: createAction('[Image] Load Images Failure', props<{ error: string }>()),
  add: createAction('[Image] Add Image', props<{ file: any; mediaType: string; imageType: string }>()),
  added: createAction('[Image] Added Image', props<{ name: string }>()),
  clearAdded: createAction('[Image] reset Added Image')
};
