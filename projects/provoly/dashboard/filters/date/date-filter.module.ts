import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BaseFilterComponent,
  BaseFilterModule,
  PryCoreModule,
  PryDatePickerModule,
  PryI18nModule,
  PryIconModule
} from '@provoly/dashboard';
import { DateFilterComponent } from './date-filter.component';

@NgModule({
  declarations: [DateFilterComponent],
  imports: [CommonModule, FormsModule, OverlayModule, PryCoreModule, PryI18nModule, PryDatePickerModule, PryIconModule],
  exports: [DateFilterComponent]
})
export class PryDateFilterModule extends BaseFilterModule {
  override getComponent() {
    return DateFilterComponent as Type<BaseFilterComponent>;
  }
}
