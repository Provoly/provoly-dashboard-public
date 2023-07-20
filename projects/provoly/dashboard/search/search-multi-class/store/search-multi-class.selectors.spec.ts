import { MultiClassCondition } from '@provoly/dashboard';
import * as fromSearchMultiClass from './search-multi-class.reducer';
import { initialSearchState } from './search-multi-class.reducer';
import { SearchMultiClassSelectors } from './search-multi-class.selectors';

const conditions: MultiClassCondition[] = [
  {
    id: 'id1',
    field: 'field1',
    operator: 'EQUALS',
    value: '1',
    isDate: false,
    pattern: '[0-9]{1}'
  },
  {
    id: 'id2',
    field: 'field2',
    operator: 'EQUALS',
    value: 'pattern',
    isDate: false,
    pattern: 'pattern'
  }
];

describe('searchMultiClassSelectors', () => {
  const initialState = { ...initialSearchState };
  it('should select the feature state', () => {
    const result = SearchMultiClassSelectors.feature({
      [fromSearchMultiClass.searchMultiClassFeatureKey]: {}
    });

    expect(result).toEqual({} as fromSearchMultiClass.SearchMultiClassState);
  });

  describe('conditions', () => {
    it('should return no items on init', () => {
      const result = SearchMultiClassSelectors.conditions.projector(initialState);

      expect(result).toEqual([]);
    });
    it('should return conditions', () => {
      const result = SearchMultiClassSelectors.conditions.projector({
        ...initialState,
        conditions
      });

      expect(result).toEqual(conditions);
    });
  });
  describe('getConditionById', () => {
    it('should return undefined', () => {
      const result = SearchMultiClassSelectors.getConditionById('id3').projector(conditions);
      expect(result).toEqual(undefined);
    });
    it('should return conditions', () => {
      const result = SearchMultiClassSelectors.getConditionById('id2').projector(conditions);
      expect(result).toEqual(conditions[1]);
    });
  });

  describe('searchMultiClassValid', () => {
    it('should return false with empty value', () => {
      const conditionsTest = [
        {
          ...conditions[0],
          value: ''
        }
      ];
      const result = SearchMultiClassSelectors.searchMultiClassValid.projector(conditionsTest);
      expect(result).toEqual(false);
    });
    it('should return false with wrong pattern', () => {
      const conditionsTest = [
        {
          ...conditions[0],
          value: 'toto'
        }
      ];
      const result = SearchMultiClassSelectors.searchMultiClassValid.projector(conditionsTest);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const conditionsTest = [conditions[0]];
      const result = SearchMultiClassSelectors.searchMultiClassValid.projector(conditionsTest);
      expect(result).toEqual(true);
    });
  });
});
