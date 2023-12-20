import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Class } from './class.interface';
import * as fromClass from './class.reducer';

const feature = createFeatureSelector<fromClass.ClassState>(fromClass.classesFeatureKey);
const entities = createSelector(feature, fromClass.selectEntities);
const classEntities = createSelector(feature, fromClass.selectAll);
const classes = createSelector(classEntities, (classes) =>
  classes.map((c) => ({
    ...c,
    attributes: c.attributes.map((attr) => ({ ...attr, technicalName: attr.technicalName ?? attr.name }))
  }))
);
const memoizeClassById = {} as any;
const classById = (id: string) => {
  if (!memoizeClassById[id]) {
    memoizeClassById[id] = createSelector(entities, (entities: { [x: string]: any }) => entities[id]);
  }
  return memoizeClassById[id];
};
const classByAttributeId = (attribute: string) =>
  createSelector(classes, (classes: Class[]) =>
    classes.find((c) => c.attributes.find((a) => a.id === attribute) !== undefined)
  );

const attributesByFieldId = (field: string) =>
  createSelector(classes, (classes: Class[]) =>
    classes.map((c) => c.attributes.filter((a) => a.field === field)).reduce((acc, attrs) => [...acc, ...attrs], [])
  );

const allAttributes = createSelector(classes, (state) => state?.flatMap((c) => c.attributes));
const classDatas = createSelector(feature, (state) => state?.classDatas);
const datasetCounts = createSelector(feature, (state) => state?.datasetCounts);
const getAttributeById = (id: string) =>
  createSelector(allAttributes, (attributes) => attributes.filter((attribute) => attribute.id === id));

export const ClassSelectors = {
  feature,
  entities,
  classes,
  classById,
  classByAttributeId,
  attributesByFieldId,
  allAttributes,
  classDatas,
  datasetCounts,
  getAttributeById
};
