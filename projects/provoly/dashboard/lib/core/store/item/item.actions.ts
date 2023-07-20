import { createAction, props } from '@ngrx/store';
import { Item } from '../../model/item.interface';

export const ItemActions = {
  create: createAction('[Item] create', props<{ item: Item }>()),
  createSuccess: createAction('[Item] create success', props<{ id: string }>()),
  createFailure: createAction('[Item] create failure', props<{ error: any }>())
};
