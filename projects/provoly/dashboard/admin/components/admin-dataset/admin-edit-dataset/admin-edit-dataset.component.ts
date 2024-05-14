import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Dataset } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminDatasetActions } from '../store/admin-dataset.actions';
import { AdminDatasetSelectors } from '../store/admin-dataset.selectors';
import { AdminDatasetState } from '../store/admin-dataset.reducer';

@Component({
  selector: 'pry-admin-edit-dataset',
  templateUrl: './admin-edit-dataset.component.html'
})
export class AdminEditDatasetComponent implements OnInit {
  datasetSelected$: Observable<Dataset | null>;

  constructor(
    private store: Store<AdminDatasetState>,
    private route: ActivatedRoute
  ) {
    this.datasetSelected$ = this.store.select(AdminDatasetSelectors.selectedDataset);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.store.dispatch(AdminDatasetActions.getDatasetById({ id: params['uuid'] }));
    });
  }
}
