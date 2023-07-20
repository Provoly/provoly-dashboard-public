import { importFeatureKey } from './import.reducer';
import { ImportSelectors } from './import.selectors';
import { HttpErrorResponse } from '@angular/common/http';

const error = new HttpErrorResponse({ error: { message: 'test' }, status: 422 });
export const initialState = {
  [importFeatureKey]: {
    loading: false,
    errors: [error],
    numberOfLines: 234
  }
};

describe('Import Selectors', () => {
  it('should select number of line imported', () => {
    expect(ImportSelectors.numberOfLines(initialState)).toEqual(234);
  });

  it('should select import errors', () => {
    expect(ImportSelectors.errors(initialState)).toEqual([error]);
  });
});
