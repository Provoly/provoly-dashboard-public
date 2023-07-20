import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PrySelectModule } from '../select/select.module';
import { PryShareComponent } from './share.component';

@NgModule({
  imports: [CommonModule, FormsModule, PrySelectModule, PryI18nModule],
  declarations: [PryShareComponent],
  exports: [PryShareComponent]
})
export class PryShareModule {}
