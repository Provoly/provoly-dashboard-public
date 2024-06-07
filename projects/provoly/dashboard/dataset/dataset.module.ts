import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PryCoreModule,
  PryDashboardModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PryModalStatusModule,
  PryOverlayModule, PrySelectModule
} from '@provoly/dashboard';
import { PrySinceDateModule } from '@provoly/dashboard/components/sinceDate';
import { PryDatasetCardComponent } from './components/dataset-card/dataset-card.component';
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
    PryDatasetCardComponent,
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
    PrySinceDateModule,
    PryModalStatusModule,
    ReactiveFormsModule,
    PryTextEditorModule,
    PrySelectModule
  ],
  exports: [PryDatasetComponent, PryDatasetCssComponent, PryDatasetCardComponent, PryDatasetDetailComponent]
})
export class PryDatasetModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'dataset', frTranslations);
    this.pryTranslateService.addLangObject('en', 'dataset', enTranslations);
  }
}
