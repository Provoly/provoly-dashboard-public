import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseWidgetComponent,
  BaseWidgetModule,
  PryCoreModule,
  PryDashboardModule,
  PryI18nModule,
  PryIconModule,
  PrySelectModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { WidgetLineDotComponent } from './widget-line-dot.component';

@NgModule({
  declarations: [WidgetLineDotComponent],
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    PryCoreModule,
    PryDashboardModule,
    PrySelectModule,
    PryIconModule,
    PryCheckboxModule,
    PryToggleModule,
    PryI18nModule
  ],
  exports: [WidgetLineDotComponent]
})
export class WidgetLineDotModule extends BaseWidgetModule {
  constructor() {
    super();
  }

  override getComponent() {
    return WidgetLineDotComponent as Type<BaseWidgetComponent>;
  }
}
