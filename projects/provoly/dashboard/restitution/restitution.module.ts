import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { PryCardModule } from '@provoly/dashboard/components/card';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PrySinceDateModule } from '@provoly/dashboard/components/sinceDate';
import { PryStepperModule } from '@provoly/dashboard/components/stepper';
import { PrySearchModule } from '@provoly/dashboard/search';
import { PryRestitutionCatalogComponent } from './components/restitution-catalog/restitution-catalog.component';
import { PryRestitutionListComponent } from './components/restitution-list/restitution-list.component';
import { PryRestitutionComponent } from './components/restitution/restitution.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PryCatalogCssComponent } from './style/css.component';

@NgModule({
  providers: [DatePipe],
  declarations: [
    PryRestitutionListComponent,
    PryRestitutionComponent,
    PryCatalogCssComponent,
    PryRestitutionCatalogComponent
  ],
  imports: [
    CommonModule,
    PryCoreModule,
    PryIconModule,
    FormsModule,
    PryStepperModule,
    PrySelectModule,
    PryDashboardModule,
    PryShareModule,
    PrySearchModule,
    PryI18nModule,
    PryCardModule,
    PryCheckboxModule,
    PryOverlayModule,
    PrySinceDateModule
  ],
  exports: [PryRestitutionListComponent, PryRestitutionComponent, PryRestitutionCatalogComponent]
})
export class PryRestitutionModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'restitution', frTranslations);
    this.pryTranslateService.addLangObject('en', 'restitution', enTranslations);
  }
}
