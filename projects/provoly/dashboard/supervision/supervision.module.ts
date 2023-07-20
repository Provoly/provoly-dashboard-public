import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  PryCoreModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PrySelectModule,
  PrySnackbarModule,
  PrySortModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { SupervisionBusinessDataComponent } from './components/supervision-business-data/supervision-business-data.component';
import { SupervisionFlowComponent } from './components/supervision-flow/supervision-flow.component';
import { SupervisionInfrastructuresComponent } from './components/supervision-infrastructures/supervision-infrastructures.component';
import { SupervisionIntegrationErrorsSelectComponent } from './components/supervision-integration-errors/supervision-integration-errors-select/supervision-integration-errors-select.component';
import { SupervisionIntegrationErrorsComponent } from './components/supervision-integration-errors/supervision-integration-errors.component';
import { SupervisionLayoutComponent } from './components/supervision-layout/supervision-layout.component';
import { SupervisionMenuComponent } from './components/supervision-menu/supervision-menu.component';
import { SupervisionTitleComponent } from './components/supervision-title/supervision-title.component';
import { PrySupervisionComponent } from './components/supervision.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { SupervisionEffects } from './store/supervision.effects';
import { supervisionFeatureKey, supervisionReducer } from './store/supervision.reducer';
import { SupervisionRoutingModule } from './supervision-routing.module';

@NgModule({
  declarations: [
    PrySupervisionComponent,
    SupervisionLayoutComponent,
    SupervisionMenuComponent,
    SupervisionInfrastructuresComponent,
    SupervisionTitleComponent,
    SupervisionBusinessDataComponent,
    SupervisionFlowComponent,
    SupervisionIntegrationErrorsComponent,
    SupervisionIntegrationErrorsSelectComponent
  ],
  imports: [
    CommonModule,
    PryCoreModule,
    SupervisionRoutingModule,
    StoreModule.forFeature(supervisionFeatureKey, supervisionReducer),
    EffectsModule.forFeature([SupervisionEffects]),
    PryIconModule,
    PrySortModule,
    PrySnackbarModule,
    PryToggleModule,
    FormsModule,
    PrySelectModule,
    PryCheckboxModule,
    PryI18nModule
  ]
})
export class PrySupervisionModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'supervision', frTranslations);
    this.pryTranslateService.addLangObject('en', 'supervision', enTranslations);
  }
}
