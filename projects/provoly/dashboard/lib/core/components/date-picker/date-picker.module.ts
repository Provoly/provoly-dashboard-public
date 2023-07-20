import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryIconModule } from '../icon/icon.module';
import { PryDatePickerComponent } from './date-picker.component';
import { DateRangeHighlightPipe } from './date-range-highlight.pipe';
import { LoopScrollColumnComponent } from './time-picker/loop-scroll-column/loop-scroll-column.component';
import { PryTimePickerComponent } from './time-picker/time-picker.component';

const PRY_DATE_PICKER_COMPONENTS = [
  PryDatePickerComponent,
  DateRangeHighlightPipe,
  PryTimePickerComponent,
  LoopScrollColumnComponent
];

@NgModule({
  declarations: [...PRY_DATE_PICKER_COMPONENTS],
  imports: [CommonModule, FormsModule, PryIconModule, PryI18nModule],
  exports: [...PRY_DATE_PICKER_COMPONENTS]
})
export class PryDatePickerModule {}
