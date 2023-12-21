import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryIconModule } from '../icon/icon.module';
import { PrySelectComponent } from './select.component';

@NgModule({
  imports: [CommonModule, FormsModule, PryIconModule, PryI18nModule],
  declarations: [PrySelectComponent],
  exports: [PrySelectComponent]
})
export class PrySelectModule {}
