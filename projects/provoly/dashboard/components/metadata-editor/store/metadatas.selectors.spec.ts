import { IMetadata, VARIABLE_TYPE } from '@provoly/dashboard';
import * as fromMetadata from './metadata.reducer';
import { initialMetadataState } from './metadata.reducer';
import { MetadataSelectors } from './metadata.selector';

describe('Metadata Selectors', () => {
  const initialState = Object.assign({}, initialMetadataState);
  it('should select the feature state', () => {
    const result = MetadataSelectors.feature({
      [fromMetadata.metadataFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('Metadata', () => {
    it('should return empty array', () => {
      const result = MetadataSelectors.metadata.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return predicates', () => {
      const metadata: IMetadata = {
        id: '1',
        name: 'name1',
        type: VARIABLE_TYPE.STRING
      };
      const result = MetadataSelectors.metadata.projector({
        ...initialState,
        metadata: [metadata]
      });
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(metadata);
    });
  });

  describe('current metadata', () => {
    it('should return empty metadata', () => {
      const result = MetadataSelectors.selectedMetadata.projector(initialState);
      expect(result).toEqual(null);
    });
    it('should return current metadata', () => {
      const metadata: IMetadata = {
        id: '1',
        name: 'name1',
        type: VARIABLE_TYPE.STRING
      };
      const result = MetadataSelectors.selectedMetadata.projector({
        ...initialState,
        metadata: [metadata],
        selectedMetadata: metadata.id
      });
      expect(result).toEqual(metadata);
    });
  });

  describe('loading', () => {
    it('should return false', () => {
      const result = MetadataSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = MetadataSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });

  describe('editable', () => {
    it('should return false', () => {
      const result = MetadataSelectors.editable.projector({ ...initialState, editable: false });
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = MetadataSelectors.editable.projector({ ...initialState, editable: true });
      expect(result).toEqual(true);
    });
  });
});
