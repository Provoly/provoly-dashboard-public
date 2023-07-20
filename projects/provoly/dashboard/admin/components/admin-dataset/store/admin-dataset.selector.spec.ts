import * as fromAdminDataset from '../store/admin-dataset.reducer';
import { initialAdminDatasetState } from './admin-dataset.reducer';
import { AdminDatasetSelectors } from './admin-dataset.selector';

describe('Dataset Metadata Selectors', () => {
  const initialState = Object.assign({}, initialAdminDatasetState);

  it('should select the feature state', () => {
    const result = AdminDatasetSelectors.feature({
      [fromAdminDataset.adminDatasetFeatureKey]: {}
    });
    expect(result).toEqual({});
  });

  describe('editable', () => {
    it('should return false', () => {
      const result = AdminDatasetSelectors.editable.projector({ ...initialState, editable: false });
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = AdminDatasetSelectors.editable.projector({ ...initialState, editable: true });
      expect(result).toEqual(true);
    });
  });
});
