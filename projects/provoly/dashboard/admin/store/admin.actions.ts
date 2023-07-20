import { createAction, props } from '@ngrx/store';
import { BaseToolboxAction } from '@provoly/dashboard';

export const AdminActions = {
  highlightMenu: createAction('[Admin] selecting highLight', props<{ menu: string }>()),
  toggleMenu: createAction('[Admin] Toggle menu'),
  routeTo: createAction('[Admin] route to', props<{ path: string; params?: { [p: string]: string } }>()),
  resetActions: createAction('[Admin] reset toolbox main and sub actions'),
  mainActions: createAction('[Admin] set toolbox main actions', props<{ actions: BaseToolboxAction[] }>()),
  subActions: createAction('[Admin] set toolbox sub actions', props<{ actions: BaseToolboxAction[] }>()),
  togglePanel: createAction('[Admin] Toggle panel', props<{ panelOpen: boolean }>()),
  selectComponentType: createAction(
    '[Admin] Select component Type for panel ',
    props<{ componentType: string | null }>()
  )
};
