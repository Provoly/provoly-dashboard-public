import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryRangeComponent } from './range.component';

@NgModule({
  imports: [PryI18nModule, CommonModule],
  declarations: [PryRangeComponent],
  exports: [PryRangeComponent]
})
export class PryRangeModule {}
