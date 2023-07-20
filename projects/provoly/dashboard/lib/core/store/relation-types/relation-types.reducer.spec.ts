import { relationTypes } from '../../../../mock/data/mockItemAdmin';
import { RelationTypesActions } from './relation-types.actions';
import { initialRelationTypeState, relationTypeReducer } from './relation-types.reducer';

describe('Link Reducer', () => {
  const initialState = Object.assign({}, initialRelationTypeState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = relationTypeReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadLinksSuccess', () => {
    it('should set links', () => {
      expect(
        relationTypeReducer(
          {
            ...initialState
          },
          RelationTypesActions.loadSuccess({ datas: relationTypes })
        )
      ).toEqual({
        ...initialState,
        relationsTypes: relationTypes
      });
    });
  });

  describe('selectLink', () => {
    it('should select Link', () => {
      expect(
        relationTypeReducer(
          {
            ...initialState,
            relationsTypes: relationTypes
          },
          RelationTypesActions.selectRelationType({ id: 'id1' })
        )
      ).toEqual({
        ...initialState,
        relationsTypes: relationTypes,
        selectedRelationType: relationTypes[0]
      });
    });
  });

  describe('unSelectLink', () => {
    it('should unselect Link', () => {
      expect(
        relationTypeReducer(
          {
            ...initialState
          },
          RelationTypesActions.unSelectRelationType()
        )
      ).toEqual({
        ...initialState,
        selectedRelationType: undefined
      });
    });
  });

  describe('openModal', () => {
    it('should openModal', () => {
      expect(
        relationTypeReducer(
          {
            ...initialState
          },
          RelationTypesActions.openModal()
        )
      ).toEqual({
        ...initialState,
        openModal: true
      });
    });
  });

  describe('closeModal', () => {
    it('should closeModal', () => {
      expect(
        relationTypeReducer(
          {
            ...initialState
          },
          RelationTypesActions.closeModal()
        )
      ).toEqual({
        ...initialState,
        openModal: false
      });
    });
  });
});
