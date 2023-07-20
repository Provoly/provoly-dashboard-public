import * as fromField from './fields.reducer';
import { initialFieldState } from './fields.reducer';
import { field } from '../../../../mock/data/mockItemAdmin';
import { FieldsSelectors } from './fields.selectors';

describe('Fields Selectors', () => {
  const initialState = Object.assign({}, initialFieldState);

  it('should select the feature state', () => {
    const result = FieldsSelectors.feature({
      [fromField.fieldsFeatureKey]: {}
    });
    expect(result).toEqual({});
  });

  describe('loading', () => {
    it('should return false', () => {
      const result = FieldsSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = FieldsSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });

  describe('selectedField', () => {
    it('should return undefined', () => {
      const result = FieldsSelectors.selectedField.projector(initialState);
      expect(result).toEqual(undefined);
    });
    it('should return selected class', () => {
      const result = FieldsSelectors.selectedField.projector({
        ...initialState,
        selectedField: field
      });
      expect(result).toEqual(field);
    });
  });
});
