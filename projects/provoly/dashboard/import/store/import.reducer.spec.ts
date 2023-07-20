import { ImportActions } from './import.actions';
import { importReducer, ImportState } from './import.reducer';
import { HttpErrorResponse } from '@angular/common/http';

describe('Import Reducer', () => {
  const initialState: ImportState = {
    loading: false,
    errors: null,
    numberOfLines: 0
  };

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = importReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('upload action', () => {
    it('should change the selected id value', () => {
      const fakeFile = new File([''], 'fakefilename.csv', { type: 'text/csv' });
      const result = importReducer(initialState, ImportActions.upload({ file: fakeFile, dataset: 'fakedatasetid' }));

      expect(result).toEqual({ ...initialState, loading: true });
    });
  });

  describe('upload action success', () => {
    it('should change the response value', () => {
      const result = importReducer(
        initialState,
        ImportActions.uploadSuccess({
          numberOfLines: 145
        })
      );

      expect(result).toEqual({
        ...initialState,
        loading: false,
        numberOfLines: 145
      });
    });
  });

  describe('upload action failed', () => {
    it('should not change state', () => {
      const error = new HttpErrorResponse({
        error: { numberOfLines: null, itemErrors: [] },
        status: 400,
        statusText: 'Bad Request'
      });
      const result = importReducer(initialState, ImportActions.uploadFailure({ errors: error.error.itemErrors }));

      expect(result).toEqual({
        ...initialState,
        loading: false,
        errors: error.error.itemErrors
      });
    });
  });
});
