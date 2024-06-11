import { NgModule } from '@angular/core';
import { SinceDatePipe } from './since-date.pipe';
import { PryI18nModule } from '../../i18n/i18n.module';

@NgModule({
  imports: [PryI18nModule],
  declarations: [SinceDatePipe],
  exports: [SinceDatePipe]
})
export class PrySinceDateModule {}
