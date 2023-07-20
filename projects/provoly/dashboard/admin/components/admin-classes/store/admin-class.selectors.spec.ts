import { attribute, classes } from '../../../../mock/data/mockItemAdmin';
import { AdminClassSelectors } from './admin-class.selectors';
import * as fromClass from './admin-class.reducer';
import { initialClassState } from './admin-class.reducer';

describe('Classes Selectors', () => {
  const initialState = Object.assign({}, initialClassState);

  it('should select the feature state', () => {
    const result = AdminClassSelectors.feature({
      [fromClass.classesFeatureKey]: {}
    });
    expect(result).toEqual({});
  });

  describe('loading', () => {
    it('should return false', () => {
      const result = AdminClassSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = AdminClassSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });

  describe('selectedClassId', () => {
    it('should return undefined', () => {
      const result = AdminClassSelectors.selectedClass.projector(initialState);
      expect(result).toEqual(undefined);
    });
    it('should return selected class id', () => {
      const result = AdminClassSelectors.selectedClass.projector({
        ...initialState,
        selectedClass: classes[0]
      });
      expect(result).toEqual(classes[0]);
    });
  });

  describe('selectedAttributeId', () => {
    it('should return selected attribute id', () => {
      const result = AdminClassSelectors.selectedAttribute.projector({
        ...initialState,
        selectedAttribute: { ...attribute, categoryName: 'category', fieldName: 'field' }
      });
      expect(result).toEqual({ ...attribute, categoryName: 'category', fieldName: 'field' });
    });
  });

  describe('interClass', () => {
    it('should return undefined', () => {
      const result = AdminClassSelectors.interClass.projector(initialState);
      expect(result).toEqual(undefined);
    });
    it('should return interclass', () => {
      const result = AdminClassSelectors.interClass.projector({
        ...initialState,
        interClass: classes[0]
      });
      expect(result).toEqual(classes[0]);
    });
  });
});
