import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseWidgetComponent,
  BaseWidgetModule,
  PryCoreModule,
  PryDashboardModule,
  PryIconModule,
  PrySelectModule
} from '@provoly/dashboard';
import { WidgetImageComponent } from './component/widget-image.component';
import { PryWidgetImageCssComponent } from './style/css.component';

@NgModule({
  declarations: [WidgetImageComponent, PryWidgetImageCssComponent],
  imports: [CommonModule, FormsModule, PryCoreModule, PryDashboardModule, PrySelectModule, PryIconModule],
  exports: [WidgetImageComponent]
})
export class WidgetImageModule extends BaseWidgetModule {
  override getComponent() {
    return WidgetImageComponent as Type<BaseWidgetComponent>;
  }
}
