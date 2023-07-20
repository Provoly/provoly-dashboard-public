import { fieldReducer, initialState } from './field.reducer';

describe('Field Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = fieldReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
