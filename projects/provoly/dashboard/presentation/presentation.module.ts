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
import { PryTitlePresentationComponent } from './components/title-presentation/title-presentation.component';
import { PryPresentationComponent } from './components/presentation.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryPresentationCssComponent } from './style/css.component';
import { A11yModule } from '@angular/cdk/a11y';
import { PryExpandPanelModule } from '@provoly/dashboard/components/metadata-editor';

@NgModule({
  providers: [],
  declarations: [
    PryPresentationComponent,
    PryAddEditPresentationComponent,
    PryTitlePresentationComponent,
    PryPresentationCssComponent
  ],
  imports: [
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
    PryCheckboxModule,
    CommonModule,
    A11yModule,
    PryExpandPanelModule
  ],
  exports: [
    PryPresentationComponent,
    PryAddEditPresentationComponent,
    PryTitlePresentationComponent,
    PryPresentationCssComponent
  ]
})
export class PryPresentationModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'presentation', frTranslations);
    this.pryTranslateService.addLangObject('en', 'presentation', enTranslations);
  }
}
