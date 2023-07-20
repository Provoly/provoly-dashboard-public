import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromClass from './admin-class.reducer';

const feature = createFeatureSelector<fromClass.AdminClassState>(fromClass.classesFeatureKey);

const loading = createSelector(feature, (state) => state?.loading);
const selectedClass = createSelector(feature, (state) => state?.selectedClass);
const selectedClassId = createSelector(selectedClass, (state) => state?.id);
const selectedAttribute = createSelector(feature, (state) => state?.selectedAttribute);
const selectedAttributeId = createSelector(selectedAttribute, (state) => state?.id);
const interClass = createSelector(feature, (state) => state?.interClass);
const interClassId = createSelector(interClass, (state) => state?.id);
const openModal = createSelector(feature, (state) => state.openModal);

export const AdminClassSelectors = {
  feature,
  loading,
  selectedClass,
  selectedClassId,
  selectedAttribute,
  selectedAttributeId,
  interClass,
  interClassId,
  openModal
};
