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
import { WidgetFocusComponent } from './widget-focus.component';
import { LocalizedNumberPipe } from './localized-number.pipe';

@NgModule({
  declarations: [WidgetFocusComponent, LocalizedNumberPipe],
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
  exports: [WidgetFocusComponent, LocalizedNumberPipe]
})
export class WidgetFocusModule extends BaseWidgetModule {
  constructor() {
    super();
  }

  override getComponent() {
    return WidgetFocusComponent as Type<BaseWidgetComponent>;
  }
}
