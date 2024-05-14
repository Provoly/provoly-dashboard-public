import { datasetFeatureKey, initialDatasetState } from './admin-dataset.reducer';
import { AdminDatasetSelectors } from './admin-dataset.selectors';
import { mockDatasets } from '@provoly/dashboard/mock/data/mockDataset';

describe('Dataset Selectors', () => {
  const initialState = { ...initialDatasetState };

  describe('selectedDataset', () => {
    it('should return null if nothing selected', () => {
      const result = AdminDatasetSelectors.selectedDataset({ [datasetFeatureKey]: initialState });

      expect(result).toBeNull();
    });
    it('should return dataset if one selected', () => {
      const result = AdminDatasetSelectors.selectedDataset.projector({
        ...initialState,
        selectedDataset: mockDatasets[0]
      });

      expect(result?.name).toEqual('fake name 1');
    });
  });
});
