import { createAction, props } from '@ngrx/store';
import { Category } from './category.interface';

export const CategoryActions = {
  load: createAction('[Category] Load Categories'),
  loadSuccess: createAction('[Category Api] (bus) Load Categories Success', props<{ categories: Category[] }>()),
  loadFailure: createAction('[Category Api] Load Categories Failure', props<{ error: string }>())
};
