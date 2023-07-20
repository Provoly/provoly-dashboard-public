import { Environment, VARIABLE_TYPE } from '@provoly/dashboard';
import * as fromEnvironment from './environment.reducer';
import { initialEnvironmentState } from './environment.reducer';
import { EnvironmentSelectors } from './environment.selectors';

const env = {
  type: VARIABLE_TYPE.STRING,
  name: 'myEnv',
  value: 'value'
} as Environment;

describe('Environment Selectors', () => {
  const initialState = Object.assign({}, initialEnvironmentState);
  it('should select the feature state', () => {
    const result = EnvironmentSelectors.feature({
      [fromEnvironment.environmentFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('environments', () => {
    it('should return empty array', () => {
      const result = EnvironmentSelectors.environments.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return Environment', () => {
      const result = EnvironmentSelectors.environments.projector({
        ...initialState,
        environments: [env]
      });
      expect(result[0]).toEqual(env);
    });
  });

  describe('currentEnv', () => {
    it('should return empty currentEnv', () => {
      const result = EnvironmentSelectors.currentEnv.projector(initialState);
      expect(result).toEqual(undefined);
    });
    it('should return currentEnv', () => {
      const result = EnvironmentSelectors.currentEnv.projector({
        ...initialState,
        currentEnv: env
      });
      expect(result).toEqual(env);
    });
  });

  describe('loading', () => {
    it('should return false', () => {
      const result = EnvironmentSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = EnvironmentSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });
});
