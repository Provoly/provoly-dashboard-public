import { createAction, props } from '@ngrx/store';
import { Environment } from '@provoly/dashboard';

export const EnvironmentActions = {
  loadEnvironments: createAction('[Admin/Environment] Load Environments'),
  loadEnvironmentsSuccess: createAction(
    '[Admin/Environment Api] Load Environments Success',
    props<{ datas: Environment[] }>()
  ),
  loadEnvironmentsFailure: createAction('[Admin/Environment Api] Load Environments Failure', props<{ error: any }>()),

  saveEnvironment: createAction('[Admin/Environment] Save Environment', props<{ env: Environment; route: string }>()),
  saveEnvironmentSuccess: createAction('[Admin/Environment Api] Save Environment Success', props<{ route: string }>()),
  saveEnvironmentFailure: createAction('[Admin/Environment Api] Save Environment Failure', props<{ error: any }>()),

  selectEnvironment: createAction('[Admin/Environment] Select Environment', props<{ name: string }>()),
  selectEnvironmentSuccess: createAction(
    '[Admin/Environment Api] Select Environment Success',
    props<{ data: Environment }>()
  ),
  selectEnvironmentFailure: createAction('[Admin/Environment Api] Select Environment Failure', props<{ error: any }>()),

  updateEnvironment: createAction('[Admin/Environment] Update Environment', props<{ env: Environment }>()),
  updateEnvironmentSuccess: createAction(
    '[Admin/Environment Api] Update Environment Success',
    props<{ env: Environment }>()
  ),
  updateEnvironmentFailure: createAction('[Admin/Environment Api] Update Environment Failure', props<{ error: any }>()),

  deleteEnvironment: createAction(
    '[Admin/Environment] Delete Environment',
    props<{ name: string; route: string; addRoute: string }>()
  ),
  deleteEnvironmentSuccess: createAction(
    '[Admin/Environment Api] Delete Environment Success',
    props<{ route: string; addRoute: string }>()
  ),
  deleteEnvironmentFailure: createAction('[Admin/Environment Api] Delete Environment Failure', props<{ error: any }>())
};
