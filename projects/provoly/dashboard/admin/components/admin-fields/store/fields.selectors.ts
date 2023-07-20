import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromField from './fields.reducer';

const feature = createFeatureSelector<fromField.FieldState>(fromField.fieldsFeatureKey);

const loading = createSelector(feature, (state) => state?.loading);
const selectedField = createSelector(feature, (state) => state?.selectedField);
const selectedFieldId = createSelector(selectedField, (state) => state?.id);

export const FieldsSelectors = {
  feature,
  loading,
  selectedField,
  selectedFieldId
};
