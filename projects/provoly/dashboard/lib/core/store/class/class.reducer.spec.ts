import { businessDatas } from '../../../../mock/data/mockItemAdmin';
import { ClassActions } from './class.actions';
import { classReducer, initialClassState } from './class.reducer';

describe('Class Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = classReducer(initialClassState, action);

      expect(result).toBe(initialClassState);
    });
  });
  describe('loadBusinessData', () => {
    it('should change loading', () => {
      expect(
        classReducer(
          {
            ...initialClassState
          },
          ClassActions.loadBusinessData()
        )
      ).toEqual({
        ...initialClassState,
        loading: true
      });
    });
  });
  describe('loadFlowsSuccess', () => {
    it('should set two flows', () => {
      expect(
        classReducer(
          {
            ...initialClassState
          },
          ClassActions.loadBusinessDataSuccess({ datas: [businessDatas[0], { ...businessDatas[0], name: 'vehicule' }] })
        )
      ).toEqual({
        ...initialClassState,
        classDatas: [businessDatas[0], { ...businessDatas[0], name: 'vehicule' }]
      });
    });
  });
  describe('loadFlowsFailure', () => {
    it('should change loading', () => {
      expect(
        classReducer(
          {
            ...initialClassState,
            loading: true
          },
          ClassActions.loadBusinessDataFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialClassState,
        loading: false
      });
    });
  });
});
