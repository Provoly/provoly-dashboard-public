import { adminMetadataRulesReducer, initialMetadataRulesState } from './metadata-rules.reducer';

describe('MetadataRules Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = adminMetadataRulesReducer(initialMetadataRulesState, action);

      expect(result).toBe(initialMetadataRulesState);
    });
  });
});
