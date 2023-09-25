import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  PryCoreModule,
  PryI18nModule,
  PryI18nService,
  PryIconModule,
  PrySortModule,
  PryToggleModule
} from '@provoly/dashboard';
import { PrySinceDateModule } from '@provoly/dashboard/components/sinceDate';
import { PryPipelineDetailsComponent } from './components/pipeline-details/pipeline-details.component';
import { PryPipelineEditorComponent } from './components/pipeline-editor/pipeline-editor.component';
import { PryPipelineListComponent } from './components/pipeline-list/pipeline-list.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { PipelineEffects } from './store/pipeline.effects';
import { pipelineFeatureKey, pipelineReducer } from './store/pipeline.reducer';
import { PryPipelineCssComponent } from './style/css.component';
import { A11yModule } from '@angular/cdk/a11y';

const components = [
  PryPipelineEditorComponent,
  PryPipelineCssComponent,
  PryPipelineListComponent,
  PryPipelineDetailsComponent
];

@NgModule({
  imports: [
    CommonModule,
    PryCoreModule,
    StoreModule.forFeature(pipelineFeatureKey, pipelineReducer),
    EffectsModule.forFeature([PipelineEffects]),
    PryIconModule,
    PryI18nModule,
    PrySortModule,
    FormsModule,
    PryToggleModule,
    PrySinceDateModule,
    ReactiveFormsModule,
    OverlayModule,
    A11yModule
  ],
  declarations: [...components],
  exports: [...components]
})
export class PryPipelineModule {
  constructor(private pryTranslateService: PryI18nService) {
    this.pryTranslateService.addLangObject('fr', 'pipeline', frTranslations);
    this.pryTranslateService.addLangObject('en', 'pipeline', enTranslations);
  }
}
