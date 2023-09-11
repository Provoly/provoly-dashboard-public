import { PryDatasetType } from '../../model/dataset.interface';
import { dataSourceFeatureKey, initialDataSourceState } from './data-source.reducer';
import { DataSourceSelectors } from './data-source.selectors';
import { Dataset } from '@provoly/dashboard';

describe('Dataset Selectors', () => {
  const initialState = { ...initialDataSourceState };
  const datasets: Dataset[] = [
    {
      sourceType: 'dataset',
      id: 'AAAA-BBBB-CCCC',
      name: 'fake name 1',
      oClass: '123456789',
      type: PryDatasetType.OPEN,
      metadata: []
    },
    {
      sourceType: 'dataset',
      id: 'CCCC-BBBB-AAAA',
      name: 'fake name 2',
      oClass: '987654321',
      type: PryDatasetType.CLOSED,
      metadata: []
    }
  ];

  it('should select the feature state', () => {});

  describe('datasetList', () => {
    it('should return empty array', () => {
      const result = DataSourceSelectors.datasets({ [dataSourceFeatureKey]: initialState });

      expect(result).toEqual([]);
    });
    it('should return datasets', () => {
      const result = DataSourceSelectors.datasets.projector({
        ...initialState,
        datasets: datasets
      });

      expect(result).toEqual(datasets);
    });
  });
  describe('selectedDataset', () => {
    it('should return null if nothing selected', () => {
      const result = DataSourceSelectors.selectedDataset({ [dataSourceFeatureKey]: initialState });

      expect(result).toBeNull();
    });
    it('should return dataset if one selected', () => {
      const result = DataSourceSelectors.selectedDataset.projector({
        ...initialState,
        selectedDataset: datasets[0]
      });

      expect(result?.name).toEqual('fake name 1');
    });
  });
});
