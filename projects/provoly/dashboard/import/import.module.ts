import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PryCoreModule, PryI18nModule, PryI18nService, PryIconModule, PrySelectModule } from '@provoly/dashboard';
import { PryImportComponent } from './components/import.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryImportRoutingModule } from './import-routing.module';
import { ImportEffects } from './store/import.effects';
import { importFeatureKey, importReducer } from './store/import.reducer';
import { PryImportCssComponent } from './style/css.component';
import {PryCheckboxModule} from "@provoly/dashboard/components/checkbox";

@NgModule({
  providers: [DatePipe],
  declarations: [PryImportComponent, PryImportCssComponent],
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
        PryCheckboxModule
    ],
  exports: [PryImportComponent]
})
export class PryImportModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'import', frTranslations);
    this.pryTranslateService.addLangObject('en', 'import', enTranslations);
  }
}
