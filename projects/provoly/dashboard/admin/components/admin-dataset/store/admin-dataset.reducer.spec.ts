import { AdminDatasetState, datasetReducer, initialDatasetState } from './admin-dataset.reducer';
import { AdminDatasetActions } from './admin-dataset.actions';
import { mockDatasets } from '@provoly/dashboard/mock/data/mockDataset';

describe('Dataset Reducer', () => {
  const initialState: AdminDatasetState = Object.assign({}, initialDatasetState);

  describe('Select dataset', () => {
    it('should select dataset', () => {
      expect(
        datasetReducer(
          {
            ...initialState
          },
          AdminDatasetActions.selectDataset({
            dataset: mockDatasets[0]
          })
        )
      ).toEqual({
        ...initialState,
        selectedDataset: mockDatasets[0]
      });
    });

    it('should unselect dataset', () => {
      AdminDatasetActions.selectDataset({
        dataset: mockDatasets[0]
      });
      expect(
        datasetReducer(
          {
            ...initialState
          },
          AdminDatasetActions.unselectDataset()
        )
      ).toEqual({
        ...initialState,
        selectedDataset: null
      });
    });
  });
});
