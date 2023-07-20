import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromEnvironment from './environment.reducer';

const feature = createFeatureSelector<fromEnvironment.EnvironmentState>(fromEnvironment.environmentFeatureKey);

const environments = createSelector(feature, (state) => state?.environments);
const loading = createSelector(feature, (state) => state?.loading);
const currentEnv = createSelector(feature, (state) => state?.currentEnv);
const currentEnvName = createSelector(currentEnv, (env) => env?.name);

export const EnvironmentSelectors = {
  feature,
  environments,
  loading,
  currentEnv,
  currentEnvName
};
