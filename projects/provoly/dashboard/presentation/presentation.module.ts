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
  PrySelectModule,
  PryShareModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PrySinceDateModule } from '@provoly/dashboard/components/sinceDate';
import { PryToolboxModule } from '@provoly/dashboard/toolbox';
import { PryAddEditPresentationComponent } from './components/add-edit-presentation/add-edit-presentation.component';
import { PryPresentationComponent } from './components/presentation.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryPresentationCssComponent } from './style/css.component';

@NgModule({
  providers: [],
  declarations: [PryPresentationComponent, PryAddEditPresentationComponent, PryPresentationCssComponent],
  imports: [
    CommonModule,
    PryIconModule,
    PryCoreModule,
    PryDashboardModule,
    ReactiveFormsModule,
    PrySelectModule,
    PrySinceDateModule,
    PryShareModule,
    FormsModule,
    PryOverlayModule,
    PryI18nModule,
    PryToolboxModule,
    PryCheckboxModule
  ],
  exports: [PryPresentationComponent, PryAddEditPresentationComponent, PryPresentationCssComponent]
})
export class PryPresentationModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'presentation', frTranslations);
    this.pryTranslateService.addLangObject('en', 'presentation', enTranslations);
  }
}
