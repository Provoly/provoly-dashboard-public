import { createAction, props } from '@ngrx/store';
import { BaseToolboxAction } from '@provoly/dashboard';
import { Infrastructure, InputFlow, IntegrationError } from './supervision-api.model';

export const SupervisionActions = {
  highLightMenu: createAction('[Supervision] selecting highLight', props<{ menu: string }>()),
  routeTo: createAction('[Supervision] route to', props<{ path: string; params?: { [p: string]: string } }>()),
  toggleMenu: createAction('[Supervision] Toggle menu'),
  resetActions: createAction('[Supervision] reset toolbox main and sub actions'),
  mainActions: createAction('[Supervision] set toolbox main actions', props<{ actions: BaseToolboxAction[] }>()),
  subActions: createAction('[Supervision] set toolbox sub actions', props<{ actions: BaseToolboxAction[] }>()),
  loadInfras: createAction('[Supervision/Infra] Load Infras'),
  loadInfrasSuccess: createAction('[Supervision/Infra Api] Load Infras Success', props<{ infras: Infrastructure[] }>()),
  loadInfrasFailure: createAction('[Supervision/Infra Api] Load Infras Failure', props<{ error: any }>()),
  scaleInfra: createAction('[Supervision/Infra] Scale infra', props<{ name: string; scale: number; up: boolean }>()),
  scaleInfraSuccess: createAction(
    '[Supervision/Infra Api] Scale infra success',
    props<{ name: string; time: string; up: boolean }>()
  ),
  scaleInfraFailure: createAction('[Supervision/Infra Api] Scale infra failure', props<{ error: any }>()),
  loadFlows: createAction('[Supervision/Flow] Load Flows'),
  loadFlowsSuccess: createAction('[Supervision/Flow Api] Load Flows Success', props<{ flows: InputFlow[] }>()),
  loadFlowsFailure: createAction('[Supervision/Flow Api] Load Flows Failure', props<{ error: any }>()),
  loadIntegrationErrors: createAction('[Supervision/Errors] Load Integration Errors'),
  loadIntegrationErrorsSuccess: createAction(
    '[Supervision/Errors Api] Load Integration Errors Success',
    props<{ integrationErrors: IntegrationError[] }>()
  ),
  loadIntegrationErrorsFailure: createAction(
    '[Supervision/Errors Api] Load Integration Errors Failure',
    props<{ error: any }>()
  ),
  toggleErrorDetails: createAction(
    '[Supervision/Errors] Toggle Side Panel With Error Details Of Chosen Class',
    props<{ error: IntegrationError | null; errorDetailsOpen: boolean }>()
  ),
  toggleClassSelection: createAction(
    '[Supervision/Errors] Select/Unselect Class for submission (Reload/Acknowledge)',
    props<{ selectedClass: string }>()
  ),
  reloadErrors: createAction('[Supervision/Errors] Reload Integration Errors'),
  reloadErrorsSuccess: createAction('[Supervision/Errors Api] Reload Integration Errors Success'),
  reloadErrorsFailure: createAction(
    '[Supervision/Errors Api] Reload Integration Errors failure',
    props<{ error: any }>()
  ),
  acknowledgeErrors: createAction('[Supervision/Errors] Acknowledge Integration Errors'),
  acknowledgeErrorsSuccess: createAction('[Supervision/Errors Api] Acknowledge Integration Errors Success'),
  acknowledgeErrorsFailure: createAction(
    '[Supervision/Errors Api] Acknowledge Integration Errors Failure',
    props<{ error: any }>()
  ),
  setRefreshInterval: createAction(
    '[Supervision/Errors] Change the interval of time for refreshing errors (in milliseconds)',
    props<{ interval: number }>()
  ),
  startAutoRefresh: createAction('[Supervision/Errors] Start auto refreshing errors'),
  stopAutoRefresh: createAction('[Supervision/Errors] Stop auto refreshing errors')
};
