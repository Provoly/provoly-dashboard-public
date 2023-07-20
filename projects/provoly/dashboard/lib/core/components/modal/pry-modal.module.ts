import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryIconModule } from '../icon/icon.module';
import { PryModalComponent } from './modal.component';

const PRY_MODAL_COMPONENTS = [PryModalComponent];

@NgModule({
  imports: [CommonModule, FormsModule, PryIconModule, PryI18nModule],
  declarations: [...PRY_MODAL_COMPONENTS],
  exports: [...PRY_MODAL_COMPONENTS]
})
export class PryModalModule {}
