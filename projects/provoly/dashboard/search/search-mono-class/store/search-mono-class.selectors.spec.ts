import { Attribute, NormalizedCondition } from '@provoly/dashboard';
import * as fromSearchMonoClass from './search-mono-class.reducer';
import { initialSearchMonoClassState, SearchMonoClassState } from './search-mono-class.reducer';
import { SearchMonoClassSelectors } from './search-mono-class.selectors';

describe('SearchMonoClassSelectors', () => {
  const initialState = { ...initialSearchMonoClassState };
  describe('Search Mono Class Selectors', () => {
    it('should select the feature state', () => {
      const result = SearchMonoClassSelectors.feature({
        [fromSearchMonoClass.searchMonoClassFeatureKey]: {}
      });

      expect(result).toEqual({} as SearchMonoClassState);
    });
  });

  describe('selectMonoClassIdSearch', () => {
    it('should return undefined', () => {
      const result = SearchMonoClassSelectors.selectMonoClassIdSearch.projector({
        ...initialState
      });
      expect(result).toEqual(undefined);
    });
    it('should return classId', () => {
      const result = SearchMonoClassSelectors.selectMonoClassIdSearch.projector({
        ...initialState,
        monoClassId: 'classId'
      });
      expect(result).toEqual('classId');
    });
  });
  describe('selectMonoClassAttributesSearch', () => {
    it('should return attributes', () => {
      const result = SearchMonoClassSelectors.selectMonoClassAttributesSearch.projector(
        {
          classId: {
            id: 'classId',
            name: 'test',
            attributes: [
              {
                id: 'id',
                field: 'field',
                multiValued: false
              } as Attribute
            ]
          }
        },
        'classId'
      );
      expect(result).toEqual([
        {
          id: 'id',
          field: 'field',
          multiValued: false
        } as Attribute
      ]);
    });
  });
  describe('selectMonoClassSearchAttributeById', () => {
    it('should return attribute', () => {
      const result = SearchMonoClassSelectors.selectMonoClassSearchAttributeById('attr').projector([
        {
          id: 'attr',
          field: 'field',
          multiValued: false
        } as Attribute
      ]);
      expect(result).toEqual({
        id: 'attr',
        field: 'field',
        multiValued: false
      } as Attribute);
    });
  });
  describe('selectMonoClassConditions', () => {
    it('should return mono class condition', () => {
      const result = SearchMonoClassSelectors.selectMonoClassConditions.projector({
        ...initialState,
        monoClassConditions: {
          masterId: 'id',
          entities: {},
          ids: []
        }
      });
      expect(result).toEqual({
        masterId: 'id',
        entities: {},
        ids: []
      });
    });
  });
  describe('selectMonoClassConditionsMasterId', () => {
    it('should return mono class condition master id', () => {
      const result = SearchMonoClassSelectors.selectMonoClassConditionsMasterId.projector({
        masterId: 'id',
        entities: {},
        ids: []
      });
      expect(result).toEqual('id');
    });
  });
  describe('selectMonoClassConditionsById', () => {
    it('should return normalized condition', () => {
      const result = SearchMonoClassSelectors.selectMonoClassConditionsById('cond1').projector({
        masterId: 'id',
        entities: {
          cond1: {
            id: 'cond1'
          } as NormalizedCondition
        },
        ids: []
      });
      expect(result).toEqual({
        id: 'cond1'
      } as NormalizedCondition);
    });
  });
  describe('searchMonoClassValid', () => {
    it('should return false with no class selected', () => {
      const result = SearchMonoClassSelectors.searchMonoClassValid.projector(
        {
          masterId: 'id',
          entities: {
            cond1: {
              id: 'cond1'
            } as NormalizedCondition
          },
          ids: []
        },
        undefined
      );
      expect(result).toEqual(false);
    });
    it('should return false with empty pattern', () => {
      const result = SearchMonoClassSelectors.searchMonoClassValid.projector(
        {
          masterId: 'id',
          entities: {
            cond1: {
              id: 'cond1',
              type: 'ATTRIBUTE',
              value: 'value'
            } as NormalizedCondition
          },
          ids: ['cond1']
        },
        'classId'
      );
      expect(result).toEqual(false);
    });
    it('should return true with no attribute condition', () => {
      const result = SearchMonoClassSelectors.searchMonoClassValid.projector(
        {
          masterId: 'id',
          entities: {
            cond1: {
              id: 'cond1',
              type: 'OR'
            } as NormalizedCondition
          },
          ids: ['cond1']
        },
        'classId'
      );
      expect(result).toEqual(true);
    });
    it('should return false with empty value', () => {
      const result = SearchMonoClassSelectors.searchMonoClassValid.projector(
        {
          masterId: 'id',
          entities: {
            cond1: {
              id: 'cond1',
              type: 'ATTRIBUTE',
              pattern: 'pattern'
            } as NormalizedCondition
          },
          ids: ['cond1']
        },
        'classId'
      );
      expect(result).toEqual(false);
    });
    it('should return false with wrong pattern', () => {
      const result = SearchMonoClassSelectors.searchMonoClassValid.projector(
        {
          masterId: 'id',
          entities: {
            cond1: {
              id: 'cond1',
              type: 'ATTRIBUTE',
              pattern: '[0-9]{1}',
              value: 'aaa'
            } as NormalizedCondition
          },
          ids: ['cond1']
        },
        'classId'
      );
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = SearchMonoClassSelectors.searchMonoClassValid.projector(
        {
          masterId: 'id',
          entities: {
            cond1: {
              id: 'cond1',
              type: 'ATTRIBUTE',
              pattern: '[0-9]{1}',
              value: '1'
            } as NormalizedCondition
          },
          ids: ['cond1']
        },
        'classId'
      );
      expect(result).toEqual(true);
    });
  });
});
