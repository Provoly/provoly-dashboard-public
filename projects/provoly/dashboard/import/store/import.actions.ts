import { createAction, props } from '@ngrx/store';

export interface ImportError {
  code: string;
  params?: {
    name?: string;
    type?: string;
    elasticError?: string;
  };
}

export interface ImportResponse {
  numberOfLines: number;
  itemErrors: { [p: string]: ImportError[] } | null;
}

export const ImportActions = {
  upload: createAction('[Import] import data', props<{ file: File; dataset: string }>()),
  uploadSuccess: createAction('[Import] import data successful', props<{ numberOfLines: number }>()),
  uploadFailure: createAction('[Import] import data failure', props<{ errors: any }>())
};
