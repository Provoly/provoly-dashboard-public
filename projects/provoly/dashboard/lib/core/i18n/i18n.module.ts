import { NgModule } from '@angular/core';
import { I18nPipe } from './i18n.pipe';

@NgModule({
  declarations: [I18nPipe],
  exports: [I18nPipe]
})
export class PryI18nModule {}
