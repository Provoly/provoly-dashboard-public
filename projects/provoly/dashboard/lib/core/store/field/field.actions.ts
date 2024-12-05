import { createAction, props } from '@ngrx/store';

import { Field } from './field.interface';

export const FieldActions = {
  load: createAction('[Field] (bus) Load Fields', props<{ force?: true }>()),
  loadSuccess: createAction('[Field Api] (bus) Load Fields Success', props<{ fields: Field[] }>()),
  loadFailure: createAction('[Field Api] (bus) Load Fields Failure', props<{ error: string }>())
};
