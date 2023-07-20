import { createReducer, on } from '@ngrx/store';
import { Field } from '@provoly/dashboard';
import { FieldsActions } from './fields.actions';

export const fieldsFeatureKey = '@pry/admin/fields';

export interface FieldState {
  loading: boolean;
  selectedField?: Field;
}

export const initialFieldState: FieldState = {
  loading: false
};

export const fieldReducer = createReducer(
  initialFieldState,
  on(FieldsActions.selectField, (state, action) => ({
    ...state,
    selectedField: action.field
  })),
  on(FieldsActions.unselectField, (state, action) => ({
    ...state,
    selectedField: undefined
  }))
);
