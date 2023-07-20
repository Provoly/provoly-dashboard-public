import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromField from './field.reducer';

const feature = createFeatureSelector<fromField.FieldState>(fromField.fieldsFeatureKey);
const entities = createSelector(feature, fromField.selectEntities);
const fields = createSelector(feature, fromField.selectAll);

const memoizeFieldById = {} as any;
const fieldById = (id: string) => {
  if (!memoizeFieldById[id]) {
    memoizeFieldById[id] = createSelector(entities, (entities: { [x: string]: any }) => entities[id]);
  }
  return memoizeFieldById[id];
};

export const FieldSelectors = {
  feature,
  entities,
  fields,
  fieldById
};
