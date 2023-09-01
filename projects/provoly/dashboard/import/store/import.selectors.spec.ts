import { importFeatureKey } from './import.reducer';
import { ImportSelectors } from './import.selectors';

export const initialState = {
  [importFeatureKey]: {
    loading: false,
    uploadedDataset: {}
  }
};

describe('Import Selectors', () => {
  it('should select loading state', () => {
    expect(ImportSelectors.loading(initialState)).toEqual(false);
  });

  it('should select uploadedDataset', () => {
    expect(ImportSelectors.uploadedDataset(initialState)).toEqual({});
  });
});
