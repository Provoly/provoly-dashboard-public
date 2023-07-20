import { AbacRule, NormalizedCondition } from './abac-rules.model';
import * as fromAbacRules from './abac-rules.reducer';
import { AbacRulesSelectors } from './abac-rules.selectors';

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

describe('Abac Rules Selectors', () => {
  const initialState = Object.assign({}, fromAbacRules.initialAbacRuleState);
  it('should select the feature state', () => {
    const result = AbacRulesSelectors.feature({
      [fromAbacRules.abacRulesFeatureKey]: {}
    });

    expect(result).toEqual({} as fromAbacRules.AbacRuleState);
  });

  describe('loading', () => {
    it('should return false', () => {
      const result = AbacRulesSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = AbacRulesSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });
  describe('abacRules', () => {
    it('should return empty array', () => {
      const result = AbacRulesSelectors.abacRules.projector(initialState);

      expect(result).toEqual([]);
    });
    it('should return one abac rule', () => {
      const result = AbacRulesSelectors.abacRules.projector({
        ...initialState,
        abacRules: [abacRule]
      });

      expect(result).toEqual([abacRule]);
    });
  });
  describe('editAbacRule', () => {
    it('should return null', () => {
      const result = AbacRulesSelectors.editAbacRule.projector(initialState);

      expect(result).toEqual(null);
    });
    it('should return edit abac rule', () => {
      const result = AbacRulesSelectors.editAbacRule.projector({
        ...initialState,
        editAbacRule: { id: 'id' } as AbacRule
      });

      expect(result).toEqual({ id: 'id' } as AbacRule);
    });
  });
  describe('editAbacRuleConditions', () => {
    it('should return empty edit conditions', () => {
      const result = AbacRulesSelectors.editAbacRuleConditions.projector(initialState);

      expect(result).toEqual({
        masterId: null,
        entities: {},
        ids: []
      });
    });
    it('should return edit conditions', () => {
      const result = AbacRulesSelectors.editAbacRuleConditions.projector({
        ...initialState,
        editAbacRuleConditions: {
          masterId: 'id',
          entities: { id: { id: 'id' } as NormalizedCondition },
          ids: ['id']
        }
      });

      expect(result).toEqual({
        masterId: 'id',
        entities: { id: { id: 'id' } as NormalizedCondition },
        ids: ['id']
      });
    });
  });
  describe('editAbacRuleType', () => {
    it('should return attribute', () => {
      const result = AbacRulesSelectors.editAbacRuleType.projector(abacRule);

      expect(result).toEqual('ATTRIBUTE');
    });
  });
  describe('editAbacRuleConditionsMasterId', () => {
    it('should return null', () => {
      const result = AbacRulesSelectors.editAbacRuleConditionsMasterId.projector({
        masterId: null,
        entities: {},
        ids: []
      });

      expect(result).toEqual(null);
    });
    it('should return edit conditions', () => {
      const result = AbacRulesSelectors.editAbacRuleConditionsMasterId.projector({
        masterId: 'id',
        entities: { id: { id: 'id' } as NormalizedCondition },
        ids: ['id']
      });

      expect(result).toEqual('id');
    });
  });
  describe('editAbacRuleConditionsTypeSelected', () => {
    it('should return undefined', () => {
      const result = AbacRulesSelectors.editAbacRuleConditionsTypeSelected.projector({
        masterId: null,
        entities: {},
        ids: []
      });

      expect(result).toEqual(undefined);
    });
    it('should return edit conditions', () => {
      const result = AbacRulesSelectors.editAbacRuleConditionsTypeSelected.projector({
        masterId: 'id',
        entities: { id: { id: 'id', type: 'ATTRIBUTE' } as NormalizedCondition },
        ids: ['id']
      });

      expect(result).toEqual('id');
    });
  });
  // describe('editAbacRuleConditionsClassSelected', () => {
  //   it('should return undefined', () => {
  //     const result = AbacRulesSelectors.editAbacRuleConditionsClassSelected.projector({
  //       masterId: null,
  //       entities: {},
  //       ids: []
  //     });

  //     expect(result).toEqual(undefined);
  //   });
  //   it('should return found class', () => {
  //     const result = AbacRulesSelectors.editAbacRuleConditionsClassSelected.projector({
  //       masterId: 'id',
  //       entities: { id: { id: 'id', type: 'ATTRIBUTE', class: 'class' } as NormalizedCondition },
  //       ids: ['id']
  //     });

  //     expect(result).toEqual('class');
  //   });
  //   it('should return undefined with no attribute condition', () => {
  //     const result = AbacRulesSelectors.editAbacRuleConditionsClassSelected.projector({
  //       masterId: 'id',
  //       entities: { id: { id: 'id', type: 'METADATA' } as NormalizedCondition },
  //       ids: ['id']
  //     });

  //     expect(result).toEqual(undefined);
  //   });
  // });
  describe('editAbacRuleConditionsById', () => {
    it('should return found class', () => {
      const result = AbacRulesSelectors.editAbacRuleConditionsById('id').projector({
        masterId: 'id',
        entities: { id: { id: 'id', type: 'ATTRIBUTE' } as NormalizedCondition },
        ids: ['id']
      });

      expect(result).toEqual({ id: 'id', type: 'ATTRIBUTE' } as NormalizedCondition);
    });
  });
});
