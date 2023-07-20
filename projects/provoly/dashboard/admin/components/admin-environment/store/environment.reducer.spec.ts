import { Environment, VARIABLE_TYPE } from '@provoly/dashboard';
import { EnvironmentActions } from './environment.actions';
import { environmentReducer, initialEnvironmentState } from './environment.reducer';

const env: Environment = {
  type: VARIABLE_TYPE.STRING,
  name: 'myEnv',
  value: 'value'
};

const routeLoadEnv = '/';

describe('Environment Reducer', () => {
  const initialState = Object.assign({}, initialEnvironmentState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = environmentReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadEnvironments', () => {
    it('should change loading', () => {
      expect(
        environmentReducer(
          {
            ...initialState
          },
          EnvironmentActions.loadEnvironments()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadEnvironmentsSuccess', () => {
    it('should set two Environment', () => {
      expect(
        environmentReducer(
          {
            ...initialState
          },
          EnvironmentActions.loadEnvironmentsSuccess({ datas: [env, { ...env, name: 'myEnv' }] })
        )
      ).toEqual({
        ...initialState,
        environments: [env, { ...env, name: 'myEnv' }]
      });
    });
  });
  describe('loadEnvironmentsFailure', () => {
    it('should change loading', () => {
      expect(
        environmentReducer(
          {
            ...initialState,
            loading: true
          },
          EnvironmentActions.loadEnvironmentsFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });

  describe('selectEnvironement', () => {
    it('should change loading', () => {
      expect(
        environmentReducer(
          {
            ...initialState
          },
          EnvironmentActions.selectEnvironment({ name: 'myEnv' })
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('selectEnvironmentSuccess', () => {
    it('should set current Environment', () => {
      expect(
        environmentReducer(
          {
            ...initialState
          },
          EnvironmentActions.selectEnvironmentSuccess({ data: env })
        )
      ).toEqual({
        ...initialState,
        currentEnv: env
      });
    });
  });
  describe('selectEnvironmentFailure', () => {
    it('should change loading', () => {
      expect(
        environmentReducer(
          {
            ...initialState,
            loading: true
          },
          EnvironmentActions.selectEnvironmentFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });

  describe('saveEnvironment', () => {
    it('should change loading', () => {
      expect(
        environmentReducer(
          {
            ...initialState
          },
          EnvironmentActions.saveEnvironment({ env: env, route: routeLoadEnv })
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('saveEnvironmentSuccess', () => {
    it('should change loading', () => {
      expect(
        environmentReducer(
          {
            ...initialState,
            loading: true
          },
          EnvironmentActions.saveEnvironmentSuccess({ route: routeLoadEnv })
        )
      ).toEqual({
        ...initialState,
        loading: false
      });
    });
  });
  describe('saveEnvironmentFailure', () => {
    it('should change loading', () => {
      expect(
        environmentReducer(
          {
            ...initialState,
            loading: true
          },
          EnvironmentActions.saveEnvironmentFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false,
        environments: []
      });
    });
  });
});
