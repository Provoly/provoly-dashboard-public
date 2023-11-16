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
import { WidgetTemplateComponent } from './component/widget-template.component';
import { PryWidgetTemplateCssComponent } from './style/css.component';

@NgModule({
  declarations: [WidgetTemplateComponent, PryWidgetTemplateCssComponent],
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
  exports: [WidgetTemplateComponent]
})
export class WidgetTemplateModule extends BaseWidgetModule {
  override getComponent() {
    return WidgetTemplateComponent as Type<BaseWidgetComponent>;
  }
}
