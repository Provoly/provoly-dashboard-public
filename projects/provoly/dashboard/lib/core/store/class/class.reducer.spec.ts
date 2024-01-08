import { classReducer, initialClassState } from './class.reducer';

describe('Class Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = classReducer(initialClassState, action);

      expect(result).toBe(initialClassState);
    });
  });
});
