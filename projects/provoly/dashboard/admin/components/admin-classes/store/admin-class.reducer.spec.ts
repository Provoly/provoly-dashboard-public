import { attribute, classes } from '../../../../mock/data/mockItemAdmin';
import { AdminClassActions } from './admin-class.actions';
import { classReducer, initialClassState } from './admin-class.reducer';

describe('Classes Reducer', () => {
  const initialState = Object.assign({}, initialClassState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = classReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('selectClass', () => {
    it('should set selected class', () => {
      expect(
        classReducer(
          {
            ...initialState
          },
          AdminClassActions.selectClass({ clazz: classes[0] })
        )
      ).toEqual({
        ...initialState,
        selectedClass: classes[0]
      });
    });
  });

  describe('unselectClass', () => {
    it('should  unselect class', () => {
      expect(
        classReducer(
          {
            ...initialState
          },
          AdminClassActions.unselectClass()
        )
      ).toEqual({
        ...initialState,
        selectedClass: undefined
      });
    });
  });

  describe('selectAttribute', () => {
    it('should set selected attribute', () => {
      expect(
        classReducer(
          {
            ...initialState
          },
          AdminClassActions.selectAttribute({
            attrExtended: { ...attribute, categoryName: 'category', fieldName: 'field' }
          })
        )
      ).toEqual({
        ...initialState,
        selectedAttribute: { ...attribute, categoryName: 'category', fieldName: 'field' }
      });
    });
  });

  describe('unselectAttribute', () => {
    it('should  unselect attribute', () => {
      expect(
        classReducer(
          {
            ...initialState
          },
          AdminClassActions.unselectAttribute()
        )
      ).toEqual({
        ...initialState,
        selectedAttribute: undefined
      });
    });
  });

  describe('saveInterClass', () => {
    it('should set inter class', () => {
      expect(
        classReducer(
          {
            ...initialState
          },
          AdminClassActions.saveInterClass({ class: classes[0], route: '/' })
        )
      ).toEqual({
        ...initialState,
        interClass: classes[0]
      });
    });
  });

  describe('saveClassSuccess', () => {
    it('should  unselect interClass', () => {
      expect(
        classReducer(
          {
            ...initialState
          },
          AdminClassActions.saveClassSuccess({ route: '/' })
        )
      ).toEqual({
        ...initialState,
        interClass: undefined
      });
    });
  });
});
