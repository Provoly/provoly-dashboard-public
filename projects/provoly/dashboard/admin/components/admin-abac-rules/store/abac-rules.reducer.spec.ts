import { AbacRulesActions } from './abac-rules.actions';
import { AbacRule, AbacRulesConditions, NormalizedCondition } from './abac-rules.model';
import { abacRuleReducer, initialAbacRuleState } from './abac-rules.reducer';

const abacRule: AbacRule = {
  active: true,
  description: 'description',
  id: 'id',
  name: 'name',
  predicate: '1',
  type: 'ATTRIBUTE',
  condition: {
    type: 'OR',
    composed: [
      {
        type: 'ATTRIBUTE',
        attribute: 'attribute',
        operator: 'EQUALS',
        value: 'value'
      }
    ]
  }
};

describe('Abac Rules Reducer', () => {
  const initialState = Object.assign({}, initialAbacRuleState);
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = abacRuleReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadAbacRules', () => {
    it('should be able to set loading to true', () => {
      expect(
        abacRuleReducer(
          {
            ...initialState
          },
          AbacRulesActions.loadAbacRules()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadAbacRulesSuccess', () => {
    it('should be able to set abac rules', () => {
      expect(
        abacRuleReducer(
          {
            ...initialState
          },
          AbacRulesActions.loadAbacRulesSuccess({ datas: [abacRule] })
        )
      ).toEqual({
        ...initialState,
        abacRules: [abacRule],
        loading: false
      });
    });
  });
  describe('loadAbacRulesFailure', () => {
    it('should be able to set loading to false', () => {
      expect(
        abacRuleReducer(
          {
            ...initialState
          },
          AbacRulesActions.loadAbacRulesFailure({ error: {} })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('saveAbacRuleSuccess', () => {
    it('should be able to set loading to false', () => {
      expect(
        abacRuleReducer(
          {
            ...initialState
          },
          AbacRulesActions.saveAbacRuleSuccess({ redirect: 'path' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('saveAbacRuleFailure', () => {
    it('should be able to set loading to false', () => {
      expect(
        abacRuleReducer(
          {
            ...initialState
          },
          AbacRulesActions.saveAbacRuleFailure({ error: {} })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('resetEditAbacRule', () => {
    it('should be able to reset edit abac rule', () => {
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRule: {
              id: 'id'
            } as AbacRule,
            editAbacRuleConditions: {
              masterId: 'id',
              ids: ['id'],
              entities: { id: {} as NormalizedCondition }
            }
          },
          AbacRulesActions.resetEditAbacRule()
        )
      ).toEqual({
        ...initialState
      });
    });
  });
  describe('updateEditAbacRule', () => {
    it('should be able to update edit abac rule', () => {
      const rule = { id: 'id', name: 'name' } as AbacRule;
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRule: {
              id: 'id'
            } as AbacRule
          },
          AbacRulesActions.updateEditAbacRule({ rule })
        )
      ).toEqual({
        ...initialState,
        editAbacRule: rule
      });
    });
  });
  describe('updateEditAbacRuleByProperty', () => {
    it('should be able to update property of edit abac rule', () => {
      const rule = { id: 'id', name: 'name' } as AbacRule;
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRule: rule
          },
          AbacRulesActions.updateEditAbacRuleByProperty({ property: 'name', value: 'name2' })
        )
      ).toEqual({
        ...initialState,
        editAbacRule: { ...rule, name: 'name2' }
      });
    });
  });
  describe('initEditAbacRuleConditions', () => {
    it('should be able to update edit abac rule condition', () => {
      const condition = {
        masterId: 'id',
        ids: ['id'],
        entities: { id: { id: 'id' } as NormalizedCondition }
      } as AbacRulesConditions;
      expect(
        abacRuleReducer(
          {
            ...initialState
          },
          AbacRulesActions.initEditAbacRuleConditions({ condition })
        )
      ).toEqual({
        ...initialState,
        editAbacRuleConditions: condition
      });
    });
  });
  describe('addEditAbacRuleConditions', () => {
    it('should be able to add edit abac rule condition', () => {
      const condition = {
        masterId: 'id',
        ids: ['id'],
        entities: { id: { id: 'id' } as NormalizedCondition }
      } as AbacRulesConditions;
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRuleConditions: condition
          },
          AbacRulesActions.addEditAbacRuleConditions({ condition: { id: 'id2' } as NormalizedCondition })
        )
      ).toEqual({
        ...initialState,
        editAbacRuleConditions: {
          ...condition,
          ids: ['id', 'id2'],
          entities: {
            id: { id: 'id' } as NormalizedCondition,
            id2: { id: 'id2' } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('addEditAbacRuleConditionsToParent', () => {
    it('should be able to add edit abac rule condition to parent', () => {
      const condition = {
        masterId: 'id',
        ids: ['id'],
        entities: { id: { id: 'id' } as NormalizedCondition }
      } as AbacRulesConditions;
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRuleConditions: condition
          },
          AbacRulesActions.addEditAbacRuleConditionsToParent({ conditionId: 'id2', parentId: 'id' })
        )
      ).toEqual({
        ...initialState,
        editAbacRuleConditions: {
          ...condition,
          entities: {
            id: { id: 'id', composed: ['id2'] } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('updateEditAbacRuleConditionProperty', () => {
    it('should be able to update edit abac rule condition', () => {
      const condition = {
        masterId: 'id',
        ids: ['id'],
        entities: { id: { id: 'id' } as NormalizedCondition }
      } as AbacRulesConditions;
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRuleConditions: condition
          },
          AbacRulesActions.updateEditAbacRuleConditionProperty({
            conditionId: 'id',
            property: { type: 'operator', value: 'EQUALS' }
          })
        )
      ).toEqual({
        ...initialState,
        editAbacRuleConditions: {
          ...condition,
          entities: {
            id: { id: 'id', operator: 'EQUALS' } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('removeEditAbacRuleLeafCondition', () => {
    it('should be able to remove edit abac rule condition', () => {
      const condition = {
        masterId: 'id',
        ids: ['id', 'id2'],
        entities: {
          id: { id: 'id' } as NormalizedCondition,
          id2: { id: 'id2' } as NormalizedCondition
        }
      } as AbacRulesConditions;
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRuleConditions: condition
          },
          AbacRulesActions.removeEditAbacRuleLeafCondition({
            conditionId: 'id2'
          })
        )
      ).toEqual({
        ...initialState,
        editAbacRuleConditions: {
          ...condition,
          ids: ['id'],
          entities: {
            id: { id: 'id' } as NormalizedCondition
          }
        }
      });
    });
  });
  describe('removeEditAbacRuleConditionFromComposed', () => {
    it('should be able to remove edit abac rule condition', () => {
      const condition = {
        masterId: 'id',
        ids: ['id'],
        entities: {
          id: { id: 'id', composed: ['id2'] } as NormalizedCondition
        }
      } as AbacRulesConditions;
      expect(
        abacRuleReducer(
          {
            ...initialState,
            editAbacRuleConditions: condition
          },
          AbacRulesActions.removeEditAbacRuleConditionFromComposed({
            conditionId: 'id',
            childrenId: 'id2'
          })
        )
      ).toEqual({
        ...initialState,
        editAbacRuleConditions: {
          ...condition,
          ids: ['id'],
          entities: {
            id: { id: 'id', composed: [] as string[] } as NormalizedCondition
          }
        }
      });
    });
  });
});
