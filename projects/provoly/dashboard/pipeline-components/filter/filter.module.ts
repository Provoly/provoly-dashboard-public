import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PryCoreModule, PryDashboardModule, PryI18nModule, PryI18nService, PrySelectModule } from '@provoly/dashboard';
import { PipelineComponentFactoryService } from '@provoly/dashboard/pipeline';
import { FilterComponent } from './component/filter.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { FilterNode } from './node-class/filter-node.class';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OverlayModule,
    PryCoreModule,
    PryDashboardModule,
    PrySelectModule,
    PryI18nModule
  ],
  declarations: [FilterComponent],
  exports: [FilterComponent]
})
export class PryPipelineFilterModule {
  constructor(
    pipelineComponentFactoryService: PipelineComponentFactoryService,
    private pryTranslateService: PryI18nService
  ) {
    this.pryTranslateService.addLangObject('fr', 'pipeline-filter', frTranslations);
    this.pryTranslateService.addLangObject('en', 'pipeline-filter', enTranslations);

    pipelineComponentFactoryService.addType('com.onepoint.pry.common.transfo.Filter', FilterComponent, FilterNode);
  }
}
