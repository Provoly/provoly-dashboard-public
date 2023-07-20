import * as fromLink from './relation-types.reducer';
import { initialRelationTypeState } from './relation-types.reducer';
import { relationTypes } from '../../../../mock/data/mockItemAdmin';
import { RelationTypesSelectors } from './relation-types.selectors';

describe('Links Selectors', () => {
  const initialState = Object.assign({}, initialRelationTypeState);
  it('should select the feature state', () => {
    const result = RelationTypesSelectors.feature({
      [fromLink.relationTypesFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('links', () => {
    it('should return empty array', () => {
      const result = RelationTypesSelectors.relationsTypes.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return RelationsTypes', () => {
      const result = RelationTypesSelectors.relationsTypes.projector({
        ...initialState,
        relationsTypes: relationTypes
      });
      expect(result[0]).toEqual(relationTypes[0]);
    });
  });

  describe('selectedLink', () => {
    it('should return empty selectedRelationType', () => {
      const result = RelationTypesSelectors.selectedRelationType.projector(initialState);
      expect(result).toEqual(undefined);
    });
    it('should return selectedRelationType', () => {
      const result = RelationTypesSelectors.selectedRelationType.projector({
        ...initialState,
        selectedRelationType: relationTypes[0]
      });
      expect(result).toEqual(relationTypes[0]);
    });
  });

  describe('openModal', () => {
    it('should return false openModal', () => {
      const result = RelationTypesSelectors.openModal.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return openModal true', () => {
      const result = RelationTypesSelectors.openModal.projector({
        ...initialState,
        openModal: true
      });
      expect(result).toEqual(true);
    });
  });
});
