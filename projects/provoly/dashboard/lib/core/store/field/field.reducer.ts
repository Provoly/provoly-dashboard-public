import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { FieldActions } from './field.actions';
import { Field } from './field.interface';

export const fieldsFeatureKey = '@pry/model/fields';

export interface FieldState extends EntityState<Field> {
  // additional entities state properties
}

export function sortByName(a: Field, b: Field): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<Field> = createEntityAdapter<Field>({
  sortComparer: sortByName
});

export const initialState: FieldState = adapter.getInitialState({
  // additional entity state properties
});

const internalReducer = createReducer(
  initialState,
  on(FieldActions.loadSuccess, (state, action) => adapter.setAll(action.fields, state))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export function fieldReducer(state: FieldState, action: Action) {
  return internalReducer(state, action);
}
