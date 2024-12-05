import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataSource, DataSourceActions, DataSourceSelectors } from '@provoly/dashboard';
import { PipelinePropertiesPanelComponent } from '@provoly/dashboard/pipeline';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-pipeline-input-dataset-definition',
  templateUrl: './input-datasource.component.html'
})
export class InputDatasourceComponent extends PipelinePropertiesPanelComponent {
  dataSources$: Observable<DataSource[]>;

  constructor(private store: Store) {
    super();
    this.store.dispatch(DataSourceActions.load({}));
    this.dataSources$ = this.store.select(DataSourceSelectors.getDataSources);
  }

  change($event: any) {
    this.node.properties['datasetId'] = $event;
    this.checkFn();
  }
}
