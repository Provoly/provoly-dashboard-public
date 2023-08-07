import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  Dataset,
  DataSourceActions,
  DataSourceSelectors,
  SubscriptionnerDirective,
  ViewMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'pry-dataset',
  templateUrl: './dataset.component.html'
})
export class PryDatasetComponent extends SubscriptionnerDirective {
  datasets$: Observable<Dataset[]>;
  selectedDataset: Dataset | null = null;
  selectedMode: ViewMode = ViewMode.CATALOG;
  ViewMode = ViewMode;
  search$ = new BehaviorSubject('');
  filteredDatasets$: Observable<Dataset[]>;

  constructor(protected store: Store<any>) {
    super();
    this.store.dispatch(DataSourceActions.load());
    this.datasets$ = this.store.select(DataSourceSelectors.datasets);
    this.store.dispatch(DashboardActions.fetchManifestsList());
    this.filteredDatasets$ = combineLatest([this.datasets$, this.search$]).pipe(
      map(([datasets, search]) =>
        datasets.filter((dataset) => search.length === 0 || dataset.name.toLowerCase().includes(search.toLowerCase()))
      )
    );
  }

  consult(dataset: Dataset) {
    this.selectedDataset = dataset;
    this.selectedMode = ViewMode.CONSULT;
  }
}
