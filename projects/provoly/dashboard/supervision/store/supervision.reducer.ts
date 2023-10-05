import { createReducer, on } from '@ngrx/store';
import { BaseMenuItem, BaseToolboxAction, BusinessData } from '@provoly/dashboard';
import { Infrastructure, InputFlow, IntegrationError, LastInfrastructureScale } from './supervision-api.model';
import { SupervisionActions } from './supervision.actions';

export const supervisionFeatureKey = '@pry/supervision';

export interface SupervisionState {
  highlightedMenu: string;
  menus: BaseMenuItem[];
  menuOpen: boolean;
  actions: BaseToolboxAction[];
  subActions: BaseToolboxAction[];
  infrastructures: Infrastructure[];
  lastInfraScale: LastInfrastructureScale | undefined;
  inputFlows: InputFlow[];
  businessDatas: BusinessData[];
  integrationErrors: IntegrationError[];
  currentIntegrationError?: IntegrationError;
  errorDetailsOpen: boolean;
  selectedClasses: string[];
  refreshInterval: number;
  loading: boolean;
}

export const initialSupervisionState: SupervisionState = {
  highlightedMenu: 'infrastructures',
  menus: [{ menu: 'integration-errors', module: 'supervision', page: 'integration_errors' }],
  menuOpen: true,
  actions: [],
  subActions: [],
  infrastructures: [],
  lastInfraScale: undefined,
  inputFlows: [],
  businessDatas: [],
  integrationErrors: [],
  errorDetailsOpen: false,
  selectedClasses: [],
  refreshInterval: 30000,
  loading: false,
  currentIntegrationError: undefined
};

export const supervisionReducer = createReducer(
  initialSupervisionState,
  on(SupervisionActions.highLightMenu, (state, action) => ({
    ...state,
    highlightedMenu: action.menu
  })),
  on(SupervisionActions.toggleMenu, (state) => ({
    ...state,
    menuOpen: !state.menuOpen
  })),
  on(SupervisionActions.resetActions, (state) => ({
    ...state,
    actions: [],
    subActions: []
  })),
  on(SupervisionActions.mainActions, (state, action) => ({
    ...state,
    actions: [...action.actions]
  })),
  on(SupervisionActions.subActions, (state, action) => ({
    ...state,
    subActions: [...action.actions]
  })),
  on(SupervisionActions.loadInfras, (state) => ({
    ...state,
    loading: true
  })),
  on(SupervisionActions.loadInfrasSuccess, (state, action) => ({
    ...state,
    infrastructures: [...action.infras],
    loading: false
  })),
  on(SupervisionActions.loadInfrasFailure, (state) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.scaleInfra, (state) => ({
    ...state,
    loading: true
  })),
  on(SupervisionActions.scaleInfraSuccess, (state, action) => ({
    ...state,
    lastInfraScale: { name: action.name, time: action.time, up: action.up }
  })),
  on(SupervisionActions.scaleInfraFailure, (state) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.loadFlows, (state) => ({
    ...state,
    loading: true
  })),
  on(SupervisionActions.loadFlowsSuccess, (state, action) => ({
    ...state,
    inputFlows: [...action.flows],
    loading: false
  })),
  on(SupervisionActions.loadFlowsFailure, (state) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.loadIntegrationErrors, (state) => ({
    ...state,
    loading: true
  })),
  on(SupervisionActions.loadIntegrationErrorsSuccess, (state, action) => ({
    ...state,
    integrationErrors: [...action.integrationErrors],
    loading: false
  })),
  on(SupervisionActions.loadIntegrationErrorsFailure, (state) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.toggleErrorDetails, (state, action) => ({
    ...state,
    currentIntegrationError: action.error,
    errorDetailsOpen: action.errorDetailsOpen
  })),
  on(SupervisionActions.toggleClassSelection, (state, action) => {
    let updatedClasses;
    if (state.selectedClasses.includes(action.selectedClass)) {
      updatedClasses = state.selectedClasses.filter((oclass) => oclass !== action.selectedClass);
    } else {
      updatedClasses = [...state.selectedClasses, action.selectedClass];
    }
    return { ...state, selectedClasses: updatedClasses };
  }),
  on(SupervisionActions.reloadErrors, (state, action) => ({
    ...state,
    loading: true
  })),
  on(SupervisionActions.reloadErrorsSuccess, (state, action) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.reloadErrorsFailure, (state, action) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.acknowledgeErrors, (state, action) => ({
    ...state,
    loading: true
  })),
  on(SupervisionActions.acknowledgeErrorsSuccess, (state, action) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.acknowledgeErrorsFailure, (state, action) => ({
    ...state,
    loading: false
  })),
  on(SupervisionActions.setRefreshInterval, (state, action) => ({
    ...state,
    refreshInterval: action.interval
  }))
);
