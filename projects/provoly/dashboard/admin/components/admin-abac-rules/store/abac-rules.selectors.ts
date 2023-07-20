import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AbacRulesConditions } from './abac-rules.model';
import * as fromAbacRules from './abac-rules.reducer';

const feature = createFeatureSelector<fromAbacRules.AbacRuleState>(fromAbacRules.abacRulesFeatureKey);

const abacRules = createSelector(feature, (state) => state?.abacRules);
const loading = createSelector(feature, (state) => state?.loading);
const editAbacRule = createSelector(feature, (state) => state?.editAbacRule);
const editAbacRuleConditions = createSelector(feature, (state) => state?.editAbacRuleConditions);
const editAbacRuleType = createSelector(editAbacRule, (rule) => rule?.type);
const editAbacRuleConditionsMasterId = createSelector(editAbacRuleConditions, (conditions) => conditions?.masterId);
const editAbacRuleConditionsTypeSelected = createSelector(editAbacRuleConditions, (conditions) =>
  (conditions?.ids ?? []).find((id) => ['METADATA', 'ATTRIBUTE'].includes(conditions.entities[id].type))
);
const editAbacRuleConditionsFirstAttribute = createSelector(editAbacRuleConditions, (conditions) => {
  const id = (conditions?.ids ?? []).find((id) => conditions.entities[id].type === 'ATTRIBUTE');
  const attribute = id !== undefined ? conditions.entities[id].attribute : undefined;
  return attribute;
});

const editAbacRuleConditionsById = (id: string) =>
  createSelector(editAbacRuleConditions, (conditions: AbacRulesConditions) => conditions.entities[id]);

export const AbacRulesSelectors = {
  feature,
  abacRules,
  loading,
  editAbacRule,
  editAbacRuleConditions,
  editAbacRuleType,
  editAbacRuleConditionsMasterId,
  editAbacRuleConditionsTypeSelected,
  editAbacRuleConditionsFirstAttribute,
  editAbacRuleConditionsById
};
