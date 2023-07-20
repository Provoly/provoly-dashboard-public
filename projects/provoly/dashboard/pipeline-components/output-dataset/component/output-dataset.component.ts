import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Dataset, DataSourceActions, DataSourceSelectors, PryDatasetType } from '@provoly/dashboard';
import { PipelinePropertiesPanelComponent } from '@provoly/dashboard/pipeline';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'pry-pipeline-output-dataset-definition',
  templateUrl: './output-dataset.component.html'
})
export class OutputDatasetComponent extends PipelinePropertiesPanelComponent {
  datasets$: Observable<Dataset[]>;

  constructor(private store: Store) {
    super();
    this.store.dispatch(DataSourceActions.dataset.loadDataset());
    this.datasets$ = this.store
      .select(DataSourceSelectors.datasets)
      .pipe(map((datasets: Dataset[]) => datasets.filter((dataset) => dataset.type === PryDatasetType.CLOSED)));
  }

  change($event: any) {
    this.node.properties['dataset'] = $event;
    this.checkFn();
  }
}
