import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Dataset, DataSourceActions, DataSourceSelectors, DataSourceState } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-admin-edit-dataset',
  templateUrl: './admin-edit-dataset.component.html'
})
export class AdminEditDatasetComponent implements OnInit {
  datasetSelected$: Observable<Dataset | null>;

  constructor(
    private store: Store<DataSourceState>,
    private route: ActivatedRoute
  ) {
    this.datasetSelected$ = this.store.select(DataSourceSelectors.selectedDataset);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.store.dispatch(DataSourceActions.dataset.getDatasetById({ id: params['uuid'] }));
    });
  }
}
