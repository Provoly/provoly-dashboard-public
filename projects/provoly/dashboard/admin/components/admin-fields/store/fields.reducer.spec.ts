import { fieldReducer, initialFieldState } from './fields.reducer';
import { FieldsActions } from './fields.actions';
import { field } from '../../../../mock/data/mockItemAdmin';

describe('Field Reducer', () => {
  const initialState = Object.assign({}, initialFieldState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = fieldReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('selectField', () => {
    it('should set selected field', () => {
      expect(
        fieldReducer(
          {
            ...initialState
          },
          FieldsActions.selectField({ field: field })
        )
      ).toEqual({
        ...initialState,
        selectedField: field
      });
    });
  });

  describe('unselectfield', () => {
    it('should  unselect class', () => {
      expect(
        fieldReducer(
          {
            ...initialState
          },
          FieldsActions.unselectField
        )
      ).toEqual({
        ...initialState,
        selectedField: undefined
      });
    });
  });
});
