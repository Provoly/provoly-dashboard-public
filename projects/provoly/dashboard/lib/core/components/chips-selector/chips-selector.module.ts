import { NgModule } from '@angular/core';
import { ChipsSelectorComponent } from './chips-selector.component';
import { PryIconModule } from '../icon/icon.module';
import { PryI18nModule } from '../../i18n/i18n.module';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ChipsSelectorComponent],
  imports: [PryIconModule, PryI18nModule, AsyncPipe, FormsModule],
  exports: [ChipsSelectorComponent]
})
export class PryChipsSelectorModule {}
