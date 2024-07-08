import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { enTranslations } from '../../../../dataset/i18n/en.translations';
import { frTranslations } from '../../../../dataset/i18n/fr.translations';
import { PryI18nModule } from '../../i18n/i18n.module';
import { PryI18nService } from '../../i18n/i18n.service';
import { PryIconModule } from '../icon/icon.module';
import { PryStatusModalComponent } from './status-modal.component';

@NgModule({
  imports: [CommonModule, PryIconModule, PryI18nModule],
  declarations: [PryStatusModalComponent],
  exports: [PryStatusModalComponent]
})
export class PryStatusModalModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'dataset', frTranslations);
    this.pryTranslateService.addLangObject('en', 'dataset', enTranslations);
  }
}
