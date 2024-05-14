import { DataSourceActions } from '@provoly/dashboard';
import { dataSourceReducer, DataSourceState, initialDataSourceState } from './data-source.reducer';
import { mockDatasets, mockDatasetVersions } from '@provoly/dashboard/mock/data/mockDataset';

describe('Dataset Reducer', () => {
  const initialState: DataSourceState = Object.assign({}, initialDataSourceState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = dataSourceReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
  describe('load dataset', () => {
    it('should change loading', () => {
      expect(
        dataSourceReducer(
          {
            ...initialState
          },
          DataSourceActions.dataset.loadDataset()
        )
      ).toEqual({
        ...initialState,
        isLoading: true
      });
    });
  });
  describe('load dataset success', () => {
    it('should set datasets', () => {
      expect(
        dataSourceReducer(
          {
            ...initialState
          },
          DataSourceActions.dataset.loadedDataset({ datasets: mockDatasets })
        )
      ).toEqual({
        ...initialState,
        datasets: mockDatasets,
        isLoading: false
      });
    });
  });
  describe('load dataset failure', () => {
    it('should set an error', () => {
      expect(
        dataSourceReducer(
          {
            ...initialState
          },
          DataSourceActions.dataset.failure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        error: 'error'
      });
    });
  });

  describe('dataset versions', () => {
    it('should filter old versions and update version list with new ones', () => {
      expect(
        dataSourceReducer(
          {
            ...initialState,
            datasetVersions: [{ ...mockDatasetVersions[0], available: false }]
          },
          DataSourceActions.dataset.updateVersionList({ id: 'dataset-id', versions: mockDatasetVersions })
        )
      ).toEqual({
        ...initialState,
        datasetVersions: mockDatasetVersions,
        isLoading: false
      });
    });
  });
});
