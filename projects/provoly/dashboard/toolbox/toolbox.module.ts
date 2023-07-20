import { CdkDrag, CdkDragHandle, CdkDropList } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

const components = [
  ClearViewComponent,
  DragWidgetsComponent,
  EditModeToggleComponent,
  LaunchTabComponent,
  NamedQueryComponent,
  SaveViewComponent,
  SelectGridLayoutComponent,
  ToolboxComponent,
  PrySelectGridLayoutCssComponent,
  PryFilterSettingsComponent
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
    CdkDragHandle
  ],
  exports: [...components]
})
export class PryToolboxModule {}
