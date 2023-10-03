import * as fromAdminUSer from './admin-metadata-user.reducer';
import { initialAdminUserState } from './admin-metadata-user.reducer';
import { AdminMetadataUserSelectors } from './admin-metadata-user.selector';

describe('Metadata Selectors', () => {
  const initialState = Object.assign({}, initialAdminUserState);
  it('should select the feature state', () => {
    const result = AdminMetadataUserSelectors.feature({
      [fromAdminUSer.adminMetadataUserFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('loading', () => {
    it('should return false', () => {
      const result = AdminMetadataUserSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = AdminMetadataUserSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });

  describe('editable', () => {
    it('should return false', () => {
      const result = AdminMetadataUserSelectors.editable.projector({ ...initialState, editable: false });
      expect(result).toEqual({ value: false });
    });
    it('should return true', () => {
      const result = AdminMetadataUserSelectors.editable.projector({ ...initialState, editable: true });
      expect(result).toEqual({ value: true });
    });
  });
});
