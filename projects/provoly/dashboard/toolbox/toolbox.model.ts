import { Type } from '@angular/core';
import { PryAccessCheck } from '@provoly/dashboard';
import { AutomateRefreshComponent } from './components/automate-refresh/automate-refresh.component';
import { ClearViewComponent } from './components/clear-view/clear-view.component';
import { PryFilterSettingsComponent } from './components/filter-settings/filter-settings.component';
import { LaunchTabComponent } from './components/launch-tab/launch-tab.component';
import { RefreshDatasetsComponent } from './components/refresh-datasets/refresh-datasets.component';
import { SaveViewComponent } from './components/save-view/save-view.component';
import { SelectGridLayoutComponent } from './components/select-grid-layout/select-grid-layout.component';
import { ToolboxActionComponent } from './components/toolbox-action/toolbox-action.component';
import { SwitchToEditContentComponent } from './components/switch-to-edit-content/switch-to-edit-content.component';
import { ShareComponent } from './components/share/share.component';
import { DeleteComponent } from './components/delete/delete.component';
import { DashboardDetailsComponent } from './components/dashboard-details/dashboard-details.component';
import { EditModeActionComponent } from './components/edit-mode-action/edit-mode-action.component';

export interface ToolboxAction {
  name: string;
  component: Type<ToolboxActionComponent>;
  access: PryAccessCheck;
  visible: boolean;
  needsOwner: boolean;
}

export const ACTIONS: ToolboxAction[] = [
  {
    name: 'edit_action',
    component: EditModeActionComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'edit' },
    needsOwner: true
  },
  {
    name: 'filter_settings',
    component: PryFilterSettingsComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'filter_settings' },
    needsOwner: false
  },
  {
    name: 'save_view',
    component: SaveViewComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'save' },
    needsOwner: false
  },
  {
    name: 'save_view_as',
    component: SaveViewComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'save' },
    needsOwner: false
  },
  {
    name: 'new_tab',
    component: LaunchTabComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'new_tab' },
    needsOwner: false
  },
  {
    name: 'clear_view',
    component: ClearViewComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'clear_view' },
    needsOwner: false
  },
  {
    name: 'default_size',
    component: SelectGridLayoutComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'default_size' },
    needsOwner: false
  },
  {
    name: 'refresh_datasets',
    component: RefreshDatasetsComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'refresh_datasets' },
    needsOwner: false
  },
  {
    name: 'automate_refresh',
    component: AutomateRefreshComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'automate_refresh' },
    needsOwner: false
  },
  {
    name: 'edit_presentation_content',
    component: SwitchToEditContentComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'edit_presentation_content' },
    needsOwner: false
  },
  {
    name: 'share',
    component: ShareComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'share' },
    needsOwner: false
  },
  {
    name: 'delete',
    component: DeleteComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'delete' },
    needsOwner: false
  },
  {
    name: 'dashboard_details',
    component: DashboardDetailsComponent,
    visible: true,
    access: { module: 'dashboard', page: 'toolbox', action: 'delete' },
    needsOwner: false
  }
];
