import { Predicate } from '@provoly/dashboard';
import * as fromPredicates from './predicates.reducer';
import { initialPredicateState } from './predicates.reducer';
import { PredicatesSelectors } from './predicates.selectors';

describe('Predicates Selectors', () => {
  const initialState = Object.assign({}, initialPredicateState);
  it('should select the feature state', () => {
    const result = PredicatesSelectors.feature({
      [fromPredicates.predicatesFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('predicates', () => {
    it('should return empty array', () => {
      const result = PredicatesSelectors.predicates.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return predicates', () => {
      const predicate = {
        id: '1',
        name: 'predicate',
        value: 'predicatevalue'
      } as Predicate;
      const result = PredicatesSelectors.predicates.projector({
        ...initialState,
        predicates: [predicate]
      });
      expect(result[0]).toEqual(predicate);
    });
  });

  describe('current predicate', () => {
    it('should return predicate undefined', () => {
      const result = PredicatesSelectors.currentPredicate.projector(initialState);
      expect(result).toEqual(undefined);
    });
    it('should return current predicate', () => {
      const predicate = {
        id: '1',
        name: 'predicate',
        value: 'predicatevalue'
      } as Predicate;
      const result = PredicatesSelectors.currentPredicate.projector({
        ...initialState,
        currentPredicate: predicate
      });
      expect(result).toEqual(predicate);
    });
  });

  describe('loading', () => {
    it('should return false', () => {
      const result = PredicatesSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = PredicatesSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });
});
