import { IMetadata, VARIABLE_TYPE } from '@provoly/dashboard';
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

  describe('Metadata', () => {
    it('should return empty array', () => {
      const result = AdminMetadataUserSelectors.metadata.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return predicates', () => {
      const metadata: IMetadata = {
        id: '1',
        name: 'name1',
        type: VARIABLE_TYPE.UUID
      };
      const result = AdminMetadataUserSelectors.metadata.projector({
        ...initialState,
        metadata: [metadata]
      });
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(metadata);
    });
  });

  describe('current metadata', () => {
    it('should return empty metadata', () => {
      const result = AdminMetadataUserSelectors.selectedMetadata.projector(initialState);
      expect(result).toEqual(null);
    });
    it('should return current metadata', () => {
      const metadata: IMetadata = {
        id: '1',
        name: 'name1',
        type: VARIABLE_TYPE.DATE
      };
      const result = AdminMetadataUserSelectors.selectedMetadata.projector({
        ...initialState,
        metadata: [metadata],
        selectedMetadata: metadata.id
      });
      expect(result).toEqual(metadata);
    });
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
