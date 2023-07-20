import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Attribute, ClassSelectors, MonoClassConditions } from '@provoly/dashboard';
import * as fromSearchMonoClass from './search-mono-class.reducer';
import { SearchMonoClassState } from './search-mono-class.reducer';

const feature = createFeatureSelector<fromSearchMonoClass.SearchMonoClassState>(
  fromSearchMonoClass.searchMonoClassFeatureKey
);

const selectMonoClassIdSearch = createSelector(feature, (state: SearchMonoClassState) => state?.monoClassId);
const selectMonoClassAttributesSearch = createSelector(
  ClassSelectors.entities,
  selectMonoClassIdSearch,
  (classes, classId?: string) => (classId ? [...new Set(classes[classId]?.attributes ?? [])] : [])
);

const selectMonoClassSearchAttributeById = (attributeId: string) =>
  createSelector(selectMonoClassAttributesSearch, (attributes: Attribute[]) =>
    attributes.find((attr) => attr.id === attributeId)
  );
const selectMonoClassConditions = createSelector(feature, (state: SearchMonoClassState) => state.monoClassConditions);
const order = createSelector(feature, (state: SearchMonoClassState) => state.order);
const selectMonoClassConditionsMasterId = createSelector(
  selectMonoClassConditions,
  (monoClassCondition: MonoClassConditions) => monoClassCondition?.masterId
);

const selectMonoClassConditionsById = (id: string) =>
  createSelector(
    selectMonoClassConditions,
    (monoClassConditions: MonoClassConditions) => monoClassConditions.entities[id]
  );

const searchMonoClassValid = createSelector(
  selectMonoClassConditions,
  selectMonoClassIdSearch,
  (conditions: MonoClassConditions, searchClassId) => {
    if (!searchClassId) {
      return false;
    }
    const attributeConditionIds = conditions.ids.filter((id) => conditions.entities[id]?.type === 'ATTRIBUTE');
    return (
      attributeConditionIds.find((id) => {
        const condition = conditions.entities[id];
        const pattern = condition?.pattern ?? '';
        const value = condition?.value ?? '';
        if (pattern === '' || value === '') {
          return true;
        }
        return !RegExp(pattern).test(`${value}`);
      }) === undefined
    );
  }
);

export const SearchMonoClassSelectors = {
  feature,
  selectMonoClassIdSearch,
  selectMonoClassAttributesSearch,
  selectMonoClassSearchAttributeById,
  selectMonoClassConditions,
  selectMonoClassConditionsById,
  selectMonoClassConditionsMasterId,
  searchMonoClassValid,
  order
};
