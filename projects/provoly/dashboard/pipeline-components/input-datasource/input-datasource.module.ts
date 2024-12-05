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
  PryI18nModule,
  PryI18nService,
  PrySelectModule
} from '@provoly/dashboard';
import { PipelineComponentFactoryService } from '@provoly/dashboard/pipeline';
import { InputDatasourceComponent } from './component/input-datasource.component';
import { enTranslations } from './i18n/en.translations';
import { frTranslations } from './i18n/fr.translations';
import { InputDatasourceNode } from './node-class/input-datasourse-node.class';

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
  declarations: [InputDatasourceComponent],
  exports: [InputDatasourceComponent]
})
export class PryPipelineInputDatasetModule {
  constructor(
    pipelineComponentFactoryService: PipelineComponentFactoryService,
    private pryTranslateService: PryI18nService,
    private store: Store
  ) {
    this.pryTranslateService.addLangObject('fr', 'pipeline-inputdsdef', frTranslations);
    this.pryTranslateService.addLangObject('en', 'pipeline-inputdsdef', enTranslations);

    this.store.dispatch(DataSourceActions.dataset.loadDataset({}));
    this.store.select(DataSourceSelectors.getDataSources).subscribe((datasources) => {
      datasources.forEach((datasource) => {
        pipelineComponentFactoryService.addType(
          'com.provoly.common.transfo.InputDatasource',
          InputDatasourceComponent,
          InputDatasourceNode,
          'input',
          datasource.name,
          true,
          { datasetId: datasource.id }
        );
      });
    });
  }
}
