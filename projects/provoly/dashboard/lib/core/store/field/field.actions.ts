import { createAction, props } from '@ngrx/store';

import { Field } from './field.interface';

export const FieldActions = {
  load: createAction('[Field] Load Fields'),
  loadSuccess: createAction('[Field Api] (bus) Load Fields Success', props<{ fields: Field[] }>()),
  loadFailure: createAction('[Field Api] Load Fields Failure', props<{ error: string }>())
};
