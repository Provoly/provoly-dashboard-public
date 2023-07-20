import { MultiClassCondition } from '@provoly/dashboard';
import { SearchMultiClassActions } from './search-multi-class.actions';
import { initialSearchState, searchMultiClassReducer, SearchMultiClassState } from './search-multi-class.reducer';

const conditions: MultiClassCondition[] = [
  {
    id: 'id1',
    field: 'field1',
    operator: 'EQUALS',
    value: 'value',
    isDate: false,
    pattern: 'pattern'
  },
  {
    id: 'id2',
    field: 'field2',
    operator: 'EQUALS',
    value: 'value',
    isDate: false,
    pattern: 'pattern'
  }
];

describe('searchMultiClassReducer', () => {
  const initialState: SearchMultiClassState = Object.assign({}, initialSearchState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = searchMultiClassReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('addMultiClassCondition', () => {
    it('should add first condition', () => {
      expect(
        searchMultiClassReducer(
          {
            ...initialState
          },
          SearchMultiClassActions.addMultiClassCondition({ condition: conditions[0] })
        )
      ).toEqual({
        ...initialState,
        conditions: [conditions[0]]
      });
    });
    it('should add one condition on existing', () => {
      expect(
        searchMultiClassReducer(
          {
            ...initialState,
            conditions: [conditions[0]]
          },
          SearchMultiClassActions.addMultiClassCondition({ condition: conditions[1] })
        )
      ).toEqual({
        ...initialState,
        conditions: [conditions[0], conditions[1]]
      });
    });
  });
  describe('removeCondition', () => {
    it('should remove second condition', () => {
      expect(
        searchMultiClassReducer(
          {
            ...initialState,
            conditions: [conditions[0], conditions[1]]
          },
          SearchMultiClassActions.removeCondition({ conditionId: 'id2' })
        )
      ).toEqual({
        ...initialState,
        conditions: [conditions[0]]
      });
    });
  });

  describe('updateConditionField', () => {
    it('should update field', () => {
      const newField = 'newField';
      expect(
        searchMultiClassReducer(
          {
            ...initialState,
            conditions: [conditions[0]]
          },
          SearchMultiClassActions.updateConditionField({ conditionId: conditions[0].id, field: newField })
        )
      ).toEqual({
        ...initialState,
        conditions: [{ ...conditions[0], field: newField }]
      });
    });
  });
  describe('updateConditionPattern', () => {
    it('should update condition pattern and isDate attribute and operator', () => {
      const newPattern = 'newPattern';
      expect(
        searchMultiClassReducer(
          {
            ...initialState,
            conditions: [conditions[0]]
          },
          SearchMultiClassActions.updateConditionPattern({
            conditionId: conditions[0].id,
            pattern: newPattern,
            isDate: true
          })
        )
      ).toEqual({
        ...initialState,
        conditions: [{ ...conditions[0], operator: 'GREATER_THAN', pattern: newPattern, isDate: true, value: null }]
      });
    });
  });
  describe('updateCondition', () => {
    it('should update condition operator', () => {
      const newOperator = 'START_WITH';
      expect(
        searchMultiClassReducer(
          {
            ...initialState,
            conditions: [conditions[0]]
          },
          SearchMultiClassActions.updateCondition({
            conditionId: conditions[0].id,
            key: 'operator',
            value: newOperator
          })
        )
      ).toEqual({
        ...initialState,
        conditions: [{ ...conditions[0], operator: newOperator }]
      });
    });
    it('should update condition value', () => {
      const newValue = 'newValue';
      expect(
        searchMultiClassReducer(
          {
            ...initialState,
            conditions: [conditions[0]]
          },
          SearchMultiClassActions.updateCondition({
            conditionId: conditions[0].id,
            key: 'value',
            value: newValue
          })
        )
      ).toEqual({
        ...initialState,
        conditions: [{ ...conditions[0], value: newValue }]
      });
    });
  });
  describe('updateConditions', () => {
    it('should update conditions array', () => {
      expect(
        searchMultiClassReducer(
          {
            ...initialState
          },
          SearchMultiClassActions.updateConditions({
            conditions: conditions
          })
        )
      ).toEqual({
        ...initialState,
        conditions: conditions
      });
    });
    it('should update conditions array with initial value', () => {
      expect(
        searchMultiClassReducer(
          {
            ...initialState,
            conditions: [conditions[0]]
          },
          SearchMultiClassActions.updateConditions({
            conditions
          })
        )
      ).toEqual({
        ...initialState,
        conditions: conditions
      });
    });
  });
});
