import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRelationTypes from './relation-types.reducer';

const feature = createFeatureSelector<fromRelationTypes.RelationTypeState>(fromRelationTypes.relationTypesFeatureKey);

const relationsTypes = createSelector(feature, (state) => {
  const arrayForSort = [...state?.relationsTypes];
  return arrayForSort.sort((a, b) => a.name.localeCompare(b.name));
});
const selectedRelationType = createSelector(feature, (state) => state?.selectedRelationType);
const openModal = createSelector(feature, (state) => state.openModal);
const openDeleteModale = createSelector(feature, (state) => state.openDeleteModale);

export const RelationTypesSelectors = {
  feature,
  relationsTypes,
  selectedRelationType,
  openModal,
  openDeleteModale
};
