import { Component, effect, input, OnInit, signal, WritableSignal } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import {
  Dataset,
  DatasetVersion,
  DataSourceActions,
  DataSourceSelectors,
  PryDialogService,
  PrySortChange,
  PryStatusModalComponent,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { PryVersionModalComponent } from '../version-modal/version-modal.component';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';

@Component({
  selector: 'pry-import-list',
  templateUrl: './import-list.component.html'
})
export class PryImportListComponent extends SubscriptionnerDirective implements OnInit {
  loadDataAction = signal(DataSourceActions.dataset.listVersions({}));
  refreshClick = input<Observable<void>>();

  datasets$: Observable<Dataset[]>;
  possibleStatus = ['LOADING', 'INDEXING', 'INACTIVE', 'ERROR', 'ACTIVE', 'DELETING', 'DELETE_ERROR'];
  datasetVersions$: Observable<DatasetVersion[]>;
  totalVersionCount$: Observable<number>;
  filters: { dataset?: string; status?: string; dateMin?: string; dateMax?: string } = {
    dataset: undefined,
    status: undefined,
    dateMin: undefined,
    dateMax: undefined
  };
  sort: { orderBy?: 'DATASET_NAME' | 'DATE'; sortBy?: 'asc' | 'desc' } = {};

  constructor(
    private store: Store,
    private dialog: PryDialogService
  ) {
    super();
    this.store.dispatch(DataSourceActions.dataset.loadDataset());
    this.datasets$ = this.store.select(DataSourceSelectors.datasets);
    this.datasetVersions$ = this.store.select(DataSourceSelectors.datasetVersions);
    this.totalVersionCount$ = this.store.select(DataSourceSelectors.totalVersionCount);
  }

  ngOnInit() {
    this.subscriptions.add(this.refreshClick()?.subscribe(() => this.loadData()));
  }

  clearFilters(): void {
    this.filters = { dataset: undefined, status: undefined, dateMin: undefined, dateMax: undefined };
    this.store.dispatch({
      ...this.loadDataAction(),
      limit: 10,
      ...this.sort
    });
  }

  loadData(): void {
    this.store.dispatch({
      ...this.loadDataAction(),
      limit: 10,
      ...this.filters,
      ...this.sort
    });
  }

  openInfoModal(version: DatasetVersion) {
    this.dialog.open(PryVersionModalComponent, {
      data: { version },
      overlayConfig: {
        positionStrategy: new GlobalPositionStrategy().centerVertically().right('20px'),
        hasBackdrop: true,
        backdropClass: 'cdk-overlay-transparent-backdrop'
      }
    });
  }

  openErrorModal(version: DatasetVersion) {
    this.dialog.open(PryStatusModalComponent, {
      data: { version }
    });
  }

  sortChange($event: PrySortChange) {
    this.sort.sortBy = $event.direction as 'asc' | 'desc';
    this.sort.orderBy = $event.active as 'DATASET_NAME' | 'DATE';
    this.loadData();
  }

  updateFilters() {
    this.loadDataAction.update((loadDataAction) => ({ ...loadDataAction, ...this.filters }));
  }
}
