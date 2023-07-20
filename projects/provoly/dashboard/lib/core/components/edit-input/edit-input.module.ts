import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryIconModule } from '../icon/icon.module';
import { PryEditInputComponent } from './edit-input.component';

const PRY_CARD_COMPONENTS = [PryEditInputComponent];

@NgModule({
  imports: [CommonModule, PryIconModule, FormsModule, PryI18nModule],
  declarations: [...PRY_CARD_COMPONENTS],
  exports: [...PRY_CARD_COMPONENTS]
})
export class PryEditInputModule {}
