import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PryCoreModule,
  PryDashboardModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PryOverlayModule,
  PrySelectModule, PrySinceDateModule
} from '@provoly/dashboard';
import { PryDatasetDetailComponent } from './components/dataset-detail/dataset-detail.component';
import { PryDatasetComponent } from './components/dataset.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryDatasetCssComponent } from './style/css.component';
import { PryDatasetVersionFormComponent } from './components/dataset-version-form/dataset-version-form.component';
import { PryTextEditorModule } from '@provoly/dashboard/components/text-editor';

@NgModule({
  declarations: [
    PryDatasetComponent,
    PryDatasetCssComponent,
    PryDatasetDetailComponent,
    PryDatasetVersionFormComponent
  ],
  imports: [
    CommonModule,
    PryIconModule,
    PryCoreModule,
    PryOverlayModule,
    PryI18nModule,
    FormsModule,
    PryDashboardModule,
    ReactiveFormsModule,
    PryTextEditorModule,
    PrySelectModule,
    PrySinceDateModule
  ],
  exports: [PryDatasetComponent, PryDatasetCssComponent, PryDatasetDetailComponent]
})
export class PryDatasetModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'dataset', frTranslations);
    this.pryTranslateService.addLangObject('en', 'dataset', enTranslations);
  }
}
