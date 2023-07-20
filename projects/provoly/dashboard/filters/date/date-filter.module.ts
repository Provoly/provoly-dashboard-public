import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseFilterComponent,
  BaseFilterModule,
  PryCoreModule,
  PryDatePickerModule,
  PryI18nModule
} from '@provoly/dashboard';
import { DateFilterComponent } from './date-filter.component';
import { PryDateFilterCssComponent } from './style/css.component';

@NgModule({
  declarations: [DateFilterComponent, PryDateFilterCssComponent],
  imports: [CommonModule, FormsModule, OverlayModule, PryCoreModule, PryI18nModule, PryDatePickerModule],
  exports: [DateFilterComponent, PryDateFilterCssComponent]
})
export class PryDateFilterModule extends BaseFilterModule {
  override getComponent() {
    return DateFilterComponent as Type<BaseFilterComponent>;
  }
}
