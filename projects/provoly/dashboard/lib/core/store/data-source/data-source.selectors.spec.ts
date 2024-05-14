import { dataSourceFeatureKey, initialDataSourceState } from './data-source.reducer';
import { DataSourceSelectors } from './data-source.selectors';
import { mockDatasets } from '@provoly/dashboard/mock/data/mockDataset';

describe('Dataset Selectors', () => {
  const initialState = { ...initialDataSourceState };

  describe('datasetList', () => {
    it('should return empty array', () => {
      const result = DataSourceSelectors.datasets({ [dataSourceFeatureKey]: initialState });

      expect(result).toEqual([]);
    });
    it('should return datasets', () => {
      const result = DataSourceSelectors.datasets.projector({
        ...initialState,
        datasets: mockDatasets
      });

      expect(result).toEqual(mockDatasets);
    });
  });
});
