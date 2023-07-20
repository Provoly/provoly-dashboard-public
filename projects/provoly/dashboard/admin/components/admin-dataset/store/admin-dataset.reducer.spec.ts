import { adminDatasetReducer, initialAdminDatasetState } from './admin-dataset.reducer';

describe('Dataset Metadata Reducer', () => {
  const initialState = Object.assign({}, initialAdminDatasetState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;
      const result = adminDatasetReducer(initialState, action);
      expect(result).toBe(initialState);
    });
  });
});
