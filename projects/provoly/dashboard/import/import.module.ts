import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  PryCoreModule,
  PryDatePickerModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PrySelectModule,
  PrySinceDateModule,
  PrySortModule
} from '@provoly/dashboard';

import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryImportRoutingModule } from './import-routing.module';
import { ImportEffects } from './store/import.effects';
import { importFeatureKey, importReducer } from './store/import.reducer';
import { PryImportCssComponent } from './style/css.component';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PryTextEditorModule } from '@provoly/dashboard/components/text-editor';
import { PryImportFormComponent } from './components/form/import-form.component';
import { PryImportListComponent } from './components/list/import-list.component';
import { PryPaginatorModule } from '@provoly/dashboard/components/paginator';
import { PryVersionModalComponent } from './components/version-modal/version-modal.component';
import { PryPageLoaderModule } from '@provoly/dashboard/components/page-loader';

@NgModule({
  providers: [DatePipe],
  declarations: [PryImportFormComponent, PryImportCssComponent, PryImportListComponent, PryVersionModalComponent],
  imports: [
    PryCoreModule,
    PrySelectModule,
    PryI18nModule,
    CommonModule,
    PryIconModule,
    FormsModule,
    PryImportRoutingModule,
    StoreModule.forFeature(importFeatureKey, importReducer),
    EffectsModule.forFeature([ImportEffects]),
    PryCheckboxModule,
    ReactiveFormsModule,
    PryTextEditorModule,
    PryDatePickerModule,
    PrySinceDateModule,
    PryPaginatorModule,
    PrySortModule,
    PryPageLoaderModule
  ],
  exports: [PryImportFormComponent, PryImportListComponent, PryVersionModalComponent]
})
export class PryImportModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'import', frTranslations);
    this.pryTranslateService.addLangObject('en', 'import', enTranslations);
  }
}
