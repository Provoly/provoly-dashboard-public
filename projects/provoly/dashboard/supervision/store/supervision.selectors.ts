import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSupervision from './supervision.reducer';

const feature = createFeatureSelector<fromSupervision.SupervisionState>(fromSupervision.supervisionFeatureKey);

const highlightedMenu = createSelector(feature, (state) => state.highlightedMenu);
const menuOpen = createSelector(feature, (state) => state.menuOpen);
const actions = createSelector(feature, (state) => state.actions);
const subActions = createSelector(feature, (state) => state.subActions);
const menus = createSelector(feature, (state) => state.menus);
const infrastructures = createSelector(feature, (state) => state.infrastructures);
const lastInfraScale = createSelector(feature, (state) => state.lastInfraScale);
const inputFlows = createSelector(feature, (state) => state.inputFlows);
const integrationErrors = createSelector(feature, (state) => state.integrationErrors ?? []);
const currentIntegrationError = createSelector(feature, (state) => state.currentIntegrationError);
const errorDetailsOpen = createSelector(feature, (state) => state.errorDetailsOpen);
const selectedClasses = createSelector(feature, (state) => state.selectedClasses);
const refreshInterval = createSelector(feature, (state) => state.refreshInterval);
const loading = createSelector(feature, (state) => state.loading);

export const SupervisionSelectors = {
  feature,
  highlightedMenu,
  menuOpen,
  menus,
  actions,
  subActions,
  infrastructures,
  lastInfraScale,
  inputFlows,
  integrationErrors,
  currentIntegrationError,
  errorDetailsOpen,
  selectedClasses,
  refreshInterval,
  loading
};
