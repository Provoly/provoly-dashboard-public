import { createReducer, on } from '@ngrx/store';
import { Environment } from '@provoly/dashboard';
import { EnvironmentActions } from './environment.actions';

export const environmentFeatureKey = '@pry/admin/environment';

export interface EnvironmentState {
  environments: Environment[];
  loading: boolean;
  currentEnv?: Environment;
}

export const initialEnvironmentState: EnvironmentState = {
  environments: [],
  loading: false
};

export const environmentReducer = createReducer(
  initialEnvironmentState,
  on(EnvironmentActions.loadEnvironments, (state, action) => ({
    ...state,
    loading: true,
    currentEnv: undefined
  })),
  on(EnvironmentActions.loadEnvironmentsSuccess, (state, action) => ({
    ...state,
    environments: [...action.datas],
    loading: false
  })),
  on(EnvironmentActions.loadEnvironmentsFailure, (state, action) => ({
    ...state,
    loading: false
  })),
  on(EnvironmentActions.saveEnvironment, (state, action) => ({
    ...state,
    loading: true
  })),
  on(EnvironmentActions.saveEnvironmentSuccess, (state, action) => ({
    ...state,
    loading: false
  })),
  on(EnvironmentActions.saveEnvironmentFailure, (state, action) => ({
    ...state,
    loading: false
  })),

  on(EnvironmentActions.selectEnvironment, (state, action) => ({
    ...state,
    loading: true
  })),
  on(EnvironmentActions.selectEnvironmentSuccess, (state, action) => ({
    ...state,
    currentEnv: action.data,
    loading: false
  })),
  on(EnvironmentActions.selectEnvironmentFailure, (state, action) => ({
    ...state,
    loading: false
  }))
);
