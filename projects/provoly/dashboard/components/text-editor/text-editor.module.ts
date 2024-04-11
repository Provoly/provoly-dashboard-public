import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PryCoreModule, PryI18nModule, PryI18nService, PryIconModule } from '@provoly/dashboard';
import { PryTextEditorCssComponent } from './style/css.component';
import { PryTextEditorComponent } from './component/text-editor.component';
import { MdToHtmlPipe } from './mdToHtml.pipe';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';

@NgModule({
  declarations: [PryTextEditorComponent, PryTextEditorCssComponent, MdToHtmlPipe],
  exports: [PryTextEditorComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PryCoreModule, PryIconModule, PryI18nModule]
})
export class PryTextEditorModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'textEditor', frTranslations);
    this.pryTranslateService.addLangObject('en', 'textEditor', enTranslations);
  }
}
