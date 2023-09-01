import { ImportActions } from './import.actions';
import { importReducer, ImportState } from './import.reducer';

describe('Import Reducer', () => {
  const initialState: ImportState = {
    loading: false
  };

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = importReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('upload action with csv', () => {
    it('should change the selected id value', () => {
      const fakeFile = new File([''], 'fakefilename.csv', { type: 'text/csv' });
      const result = importReducer(
        initialState,
        ImportActions.upload({ file: fakeFile, dataset: 'fakedatasetid', fileType: 'csv' })
      );

      expect(result).toEqual({ ...initialState, loading: true });
    });
  });

  describe('upload action with shapefile', () => {
    it('should change the selected id value', () => {
      const fakeFile = new File([''], 'fakefilename.zip', { type: 'application/shp' });
      const result = importReducer(
        initialState,
        ImportActions.upload({ file: fakeFile, dataset: 'fakedatasetid', fileType: 'zip' })
      );
      expect(result).toEqual({ ...initialState, loading: true });
    });
  });

  describe('upload action success', () => {
    it('should change the response value', () => {
      const result = importReducer(
        initialState,
        ImportActions.uploadSuccess({
          uploadedDataset: {}
        })
      );

      expect(result).toEqual({
        ...initialState,
        loading: false,
        uploadedDataset: {}
      });
    });
  });
});
