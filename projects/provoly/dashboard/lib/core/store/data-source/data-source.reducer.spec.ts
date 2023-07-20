import { Dataset, DataSourceActions, PryDatasetType } from '@provoly/dashboard';
import { dataSourceReducer, DataSourceState, initialDataSourceState } from './data-source.reducer';

describe('Dataset Reducer', () => {
  const initialState: DataSourceState = Object.assign({}, initialDataSourceState);
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
          DataSourceActions.dataset.loadedDataset({ datasets: datasets })
        )
      ).toEqual({
        ...initialState,
        datasets: datasets,
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
  describe('Select dataset', () => {
    it('should select dataset', () => {
      expect(
        dataSourceReducer(
          {
            ...initialState
          },
          DataSourceActions.dataset.selectDataset({
            dataset: {
              sourceType: 'dataset',
              id: 'CCCC-BBBB-AAAA',
              name: 'fake name 2',
              oClass: '987654321',
              type: PryDatasetType.CLOSED,
              metadata: []
            }
          })
        )
      ).toEqual({
        ...initialState,
        selectedDataset: {
          sourceType: 'dataset',
          id: 'CCCC-BBBB-AAAA',
          name: 'fake name 2',
          oClass: '987654321',
          type: PryDatasetType.CLOSED,
          metadata: []
        }
      });
    });
  });
  describe('Select unselect dataset', () => {
    it('should unselect dataset', () => {
      DataSourceActions.dataset.selectDataset({
        dataset: {
          id: 'CCCC-BBBB-AAAA',
          name: 'fake name 2',
          oClass: '987654321',
          type: PryDatasetType.CLOSED,
          metadata: [],
          sourceType: 'dataset'
        }
      });
      expect(
        dataSourceReducer(
          {
            ...initialState
          },
          DataSourceActions.dataset.unselectDataset()
        )
      ).toEqual({
        ...initialState,
        selectedDataset: null
      });
    });
  });
});
