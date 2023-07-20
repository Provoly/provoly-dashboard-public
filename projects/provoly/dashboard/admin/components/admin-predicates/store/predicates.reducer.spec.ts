import { Predicate } from '@provoly/dashboard';
import { PredicatesActions } from './predicates.actions';
import { initialPredicateState, predicateReducer } from './predicates.reducer';

const routeToPred = '/';

describe('Predicates Reducer', () => {
  const initialState = Object.assign({}, initialPredicateState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = predicateReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadPredicates', () => {
    it('should change loading', () => {
      expect(
        predicateReducer(
          {
            ...initialState
          },
          PredicatesActions.loadPredicates()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadInfrasSuccess', () => {
    it('should set two predicates', () => {
      const predicate: Predicate = {
        id: '1',
        name: 'predicate',
        value: 'value'
      };
      expect(
        predicateReducer(
          {
            ...initialState
          },
          PredicatesActions.loadPredicatesSuccess({ datas: [predicate, { ...predicate, name: 'name2' }] })
        )
      ).toEqual({
        ...initialState,
        predicates: [predicate, { ...predicate, name: 'name2' }]
      });
    });
  });
  describe('loadInfrasFailure', () => {
    it('should change loading', () => {
      expect(
        predicateReducer(
          {
            ...initialState,
            loading: true
          },
          PredicatesActions.loadPredicatesFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });

  describe('selectPredicate', () => {
    it('should change loading', () => {
      let num = '1';
      expect(
        predicateReducer(
          {
            ...initialState
          },
          PredicatesActions.selectPredicate({ id: num })
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('selectPredicateSuccess', () => {
    it('should set current predicates', () => {
      const predicate: Predicate = {
        id: '1',
        name: 'predicate',
        value: 'value'
      };
      expect(
        predicateReducer(
          {
            ...initialState
          },
          PredicatesActions.selectPredicateSuccess({ data: predicate })
        )
      ).toEqual({
        ...initialState,
        currentPredicate: predicate
      });
    });
  });
  describe('selectPredicateFailure', () => {
    it('should change loading', () => {
      expect(
        predicateReducer(
          {
            ...initialState,
            loading: true
          },
          PredicatesActions.selectPredicateFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });

  describe('savePredicate', () => {
    it('should change loading', () => {
      const predicate: Predicate = {
        id: '1',
        name: 'predicate',
        value: 'value'
      };
      expect(
        predicateReducer(
          {
            ...initialState
          },
          PredicatesActions.savePredicate({ predicate: predicate, route: routeToPred })
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('savePredicateSuccess', () => {
    it('should change loading', () => {
      expect(
        predicateReducer(
          {
            ...initialState,
            loading: true
          },
          PredicatesActions.savePredicateSuccess({ route: routeToPred })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('savePredicateFailure', () => {
    it('should change loading', () => {
      expect(
        predicateReducer(
          {
            ...initialState,
            loading: true
          },
          PredicatesActions.savePredicateFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false,
        predicates: []
      });
    });
  });
});
