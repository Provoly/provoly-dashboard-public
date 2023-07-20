import { createReducer, on } from '@ngrx/store';
import { AbacRulesActions } from './abac-rules.actions';
import { AbacRule, AbacRulesConditions } from './abac-rules.model';

export const abacRulesFeatureKey = '@pry/admin/abacRules';

export interface AbacRuleState {
  abacRules: AbacRule[];
  loading: boolean;
  editAbacRule: AbacRule | null;
  editAbacRuleConditions: AbacRulesConditions;
}

export const initialAbacRuleState: AbacRuleState = {
  abacRules: [],
  loading: false,
  editAbacRule: null,
  editAbacRuleConditions: {
    masterId: null,
    ids: [],
    entities: {}
  }
};

export const abacRuleReducer = createReducer(
  initialAbacRuleState,
  on(AbacRulesActions.loadAbacRules, (state) => ({
    ...state,
    loading: true
  })),
  on(AbacRulesActions.loadAbacRulesSuccess, (state, action) => ({
    ...state,
    abacRules: [...action.datas],
    loading: false
  })),
  on(AbacRulesActions.loadAbacRulesFailure, (state) => ({
    ...state,
    loading: false
  })),

  on(AbacRulesActions.saveAbacRuleSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(AbacRulesActions.saveAbacRuleFailure, (state) => ({
    ...state,
    loading: false
  })),

  on(AbacRulesActions.resetEditAbacRule, (state) => ({
    ...state,
    editAbacRule: null,
    editAbacRuleConditions: {
      masterId: null,
      entities: {},
      ids: []
    }
  })),
  on(AbacRulesActions.updateEditAbacRule, (state, action) => ({
    ...state,
    editAbacRule: action.rule
  })),
  on(AbacRulesActions.updateEditAbacRuleByProperty, (state, action) => ({
    ...state,
    editAbacRule: state.editAbacRule ? { ...state?.editAbacRule, [action.property]: action.value } : null
  })),
  on(AbacRulesActions.initEditAbacRuleConditions, (state, action) => ({
    ...state,
    editAbacRuleConditions: action.condition
  })),
  on(AbacRulesActions.addEditAbacRuleConditions, (state, action) => ({
    ...state,
    editAbacRuleConditions: {
      ...state.editAbacRuleConditions,
      ids: [...state.editAbacRuleConditions.ids, action.condition.id],
      entities: {
        ...state.editAbacRuleConditions.entities,
        [action.condition.id]: action.condition
      }
    }
  })),
  on(AbacRulesActions.addEditAbacRuleConditionsToParent, (state, action) => ({
    ...state,
    editAbacRuleConditions: {
      ...state.editAbacRuleConditions,
      entities: {
        ...state.editAbacRuleConditions.entities,
        [action.parentId]: {
          ...state.editAbacRuleConditions.entities[action.parentId],
          composed: [...(state.editAbacRuleConditions.entities[action.parentId].composed ?? []), action.conditionId]
        }
      }
    }
  })),
  on(AbacRulesActions.updateEditAbacRuleConditionProperty, (state, action) => ({
    ...state,
    editAbacRuleConditions: {
      ...state.editAbacRuleConditions,
      entities: {
        ...state.editAbacRuleConditions.entities,
        [action.conditionId]: {
          ...state.editAbacRuleConditions.entities[action.conditionId],
          [action.property.type]: action.property.value
        }
      }
    }
  })),
  on(AbacRulesActions.removeEditAbacRuleLeafCondition, (state, action) => {
    const ids = [...state.editAbacRuleConditions.ids.filter((id) => id !== action.conditionId)];
    const { [action.conditionId]: value, ...entities } = { ...state.editAbacRuleConditions.entities };
    return {
      ...state,
      editAbacRuleConditions: {
        ...state.editAbacRuleConditions,
        ids,
        entities
      }
    };
  }),
  on(AbacRulesActions.removeEditAbacRuleConditionFromComposed, (state, action) => {
    const composed = [
      ...(state.editAbacRuleConditions.entities[action.conditionId]?.composed?.filter(
        (id) => id !== action.childrenId
      ) ?? [])
    ];
    return {
      ...state,
      editAbacRuleConditions: {
        ...state.editAbacRuleConditions,
        entities: {
          ...state.editAbacRuleConditions.entities,
          [action.conditionId]: {
            ...state.editAbacRuleConditions.entities[action.conditionId],
            composed
          }
        }
      }
    };
  })
);
