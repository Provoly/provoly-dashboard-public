import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PryCoreModule,
  PryDashboardModule,
  PryI18nModule,
  PryIconModule,
  PryOverlayModule,
  PrySelectModule,
  PryShareModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PryStepperModule } from '@provoly/dashboard/components/stepper';
import { ClearViewComponent } from './components/clear-view/clear-view.component';
import { DragWidgetsComponent } from './components/drag-widgets/drag-widgets.component';
import { EditModeToggleComponent } from './components/edit-mode-toggle/edit-mode-toggle.component';
import { PryFilterSettingsComponent } from './components/filter-settings/filter-settings.component';
import { LaunchTabComponent } from './components/launch-tab/launch-tab.component';
import { NamedQueryComponent } from './components/named-query/named-query.component';
import { SaveViewComponent } from './components/save-view/save-view.component';
import { SelectGridLayoutComponent } from './components/select-grid-layout/select-grid-layout.component';
import { ToolboxComponent } from './components/toolbox.component';
import { PrySelectGridLayoutCssComponent } from './style/css.component';
import { RefreshDatasetsComponent } from './components/refresh-datasets/refresh-datasets.component';
import { AutomateRefreshComponent } from './components/automate-refresh/automate-refresh.component';
import { A11yModule } from '@angular/cdk/a11y';
import { SwitchToEditContentComponent } from './components/switch-to-edit-content/switch-to-edit-content.component';
import { ShareComponent } from './components/share/share.component';
import { DeleteComponent } from './components/delete/delete.component';
import { DashboardDetailsComponent } from './components/dashboard-details/dashboard-details.component';
import { EditModeActionComponent } from './components/edit-mode-action/edit-mode-action.component';
import { PryTextEditorModule } from '@provoly/dashboard/components/text-editor';
import { EditPresentationComponent } from './components/edit-presentation/edit-presentation.component';
import { PresentationFormComponent } from './shared/presentation-form/presentation-form.component';
import { ToolboxActionInstanciatorComponent } from './shared/toolbox-action-instanciator/toolbox-action-instanciator.component';
import { ToolboxActionComponent } from './shared/toolbox-action/toolbox-action.component';

const components = [
  ToolboxActionComponent,
  ToolboxActionInstanciatorComponent,
  ClearViewComponent,
  DragWidgetsComponent,
  EditModeToggleComponent,
  LaunchTabComponent,
  NamedQueryComponent,
  SaveViewComponent,
  SelectGridLayoutComponent,
  ToolboxComponent,
  PrySelectGridLayoutCssComponent,
  PryFilterSettingsComponent,
  RefreshDatasetsComponent,
  AutomateRefreshComponent,
  SwitchToEditContentComponent,
  ShareComponent,
  DeleteComponent,
  DashboardDetailsComponent,
  EditModeActionComponent,
  EditPresentationComponent,
  PresentationFormComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    PryOverlayModule,
    PryCoreModule,
    PryDashboardModule,
    PrySelectModule,
    PryIconModule,
    PryCheckboxModule,
    PryToggleModule,
    PryStepperModule,
    PryShareModule,
    PryI18nModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    A11yModule,
    PryTextEditorModule,
    ReactiveFormsModule
  ],
  exports: [...components]
})
export class PryToolboxModule {}
