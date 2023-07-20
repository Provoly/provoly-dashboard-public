import { createAction, props } from '@ngrx/store';
import { AbacRule, AbacRulesConditions, ConditionType, NormalizedCondition, OperatorType } from './abac-rules.model';

export const AbacRulesActions = {
  loadAbacRules: createAction('[Admin/Abac] Load Abac rules'),
  loadAbacRulesSuccess: createAction('[Admin/Abac Api] Load Abac rule Success', props<{ datas: AbacRule[] }>()),
  loadAbacRulesFailure: createAction('[Admin/Abac Api] Load Abac rule Failure', props<{ error: any }>()),

  saveEditAbacRule: createAction('[Admin/Abac] build abac rules', props<{ redirect: string }>()),
  saveAbacRuleSuccess: createAction('[Admin/Abac Api] Save Abac rule Success', props<{ redirect: string }>()),
  saveAbacRuleFailure: createAction('[Admin/Abac Api] Save Abac rule Failure', props<{ error: any }>()),

  cancelAbacRuleEdition: createAction('[Admin/Abac Api] Cancel Abac Rule edition', props<{ redirect: string }>()),

  initEditAbacRule: createAction('[Admin/Abac] init edit abac rule', props<{ rule: AbacRule }>()),
  resetEditAbacRule: createAction('[Admin/Abac] reset edit abac rule'),
  updateEditAbacRuleByProperty: createAction(
    '[Admin/Abac] update edit abac rule property',
    props<{ property: keyof AbacRule; value: string }>()
  ),
  updateEditAbacRule: createAction('[Admin/Abac] update edit abac rule', props<{ rule: AbacRule }>()),
  initEditAbacRuleConditions: createAction(
    '[Admin/Abac] init edit abac rule conditions',
    props<{ condition: AbacRulesConditions }>()
  ),
  createEditAbacRuleMetadataCondition: createAction(
    '[Admin/Abac] create edit metadata condition',
    props<{ metadataId: string; parentId: string }>()
  ),
  createEditAbacRuleAttributeCondition: createAction(
    '[Admin/Abac] create edit attribute condition',
    props<{ attributeId: string; classId: string; parentId: string }>()
  ),
  createEditAbacRuleNestedCondition: createAction(
    '[Admin/Abac] create edit nested condition',
    props<{ parentId: string }>()
  ),
  addEditAbacRuleConditions: createAction(
    '[Admin/Abac] add edit condition metadata',
    props<{ condition: NormalizedCondition }>()
  ),
  addEditAbacRuleConditionsToParent: createAction(
    '[Admin/Abac] add edit condition to Parent',
    props<{ conditionId: string; parentId: string }>()
  ),
  updateEditAbacRuleConditionProperty: createAction(
    '[Admin/Abac] update condition value',
    props<{
      conditionId: string;
      property:
        | { type: 'operator'; value: OperatorType }
        | { type: 'value'; value: any }
        | { type: 'type'; value: ConditionType };
    }>()
  ),
  removeEditAbacRuleLeafCondition: createAction('[Admin/Abac] delete leaf condition', props<{ conditionId: string }>()),
  removeEditAbacRuleConditionFromComposed: createAction(
    '[Admin/Abac] remove children condition',
    props<{ conditionId: string; childrenId: string }>()
  ),

  fetchAbacRule: createAction('[Admin/Abac] Fetch Abac rules', props<{ id: string }>()),
  fetchAbacRuleSuccess: createAction('[Admin/Abac Api] Fetch Abac rule Success', props<{ rule: AbacRule }>()),
  fetchAbacRuleFailure: createAction('[Admin/Abac Api] Fetch Abac rule Failure', props<{ error: any }>()),

  loadEditAbacRule: createAction('[Admin/Abac] load edit abac rule', props<{ rule: AbacRule }>())
};
