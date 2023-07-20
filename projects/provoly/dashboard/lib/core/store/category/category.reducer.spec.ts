import { categoryReducer, initialCassState } from './category.reducer';

describe('Category Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = categoryReducer(initialCassState, action);

      expect(result).toBe(initialCassState);
    });
  });
});
