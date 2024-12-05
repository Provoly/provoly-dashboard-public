import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  DataSourceActions,
  DataSourceSelectors,
  PryCoreModule,
  PryDashboardModule,
  PryDatasetType,
  PryI18nModule,
  PryI18nService,
  PrySelectModule
} from '@provoly/dashboard';
import { PipelineComponentFactoryService } from '@provoly/dashboard/pipeline';
import { OutputDatasetComponent } from './component/output-dataset.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { OutputDatasetNode } from './node-class/output-dataset-node.class';

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
  declarations: [OutputDatasetComponent],
  exports: [OutputDatasetComponent]
})
export class PryPipelineOutputDatasetModule {
  constructor(
    pipelineComponentFactoryService: PipelineComponentFactoryService,
    private pryTranslateService: PryI18nService,
    private store: Store
  ) {
    this.pryTranslateService.addLangObject('fr', 'pipeline-outputdsdef', frTranslations);
    this.pryTranslateService.addLangObject('en', 'pipeline-outputdsdef', enTranslations);

    this.store.dispatch(DataSourceActions.dataset.loadDataset({}));
    this.store.select(DataSourceSelectors.datasets).subscribe((datasources) => {
      const closedDatasources = datasources.filter((def) => def.type === PryDatasetType.CLOSED);
      closedDatasources.forEach((datasource) => {
        pipelineComponentFactoryService.addType(
          'com.provoly.common.transfo.OutputDataset',
          OutputDatasetComponent,
          OutputDatasetNode,
          'output',
          datasource.name,
          true,
          { dataset: datasource.id }
        );
      });
    });
  }
}
