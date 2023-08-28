import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardSelectors,
  Dataset,
  DatasetVersion,
  DataSourceActions,
  DataSourceSelectors,
  ResultSets,
  SearchActions,
  ViewMode,
  WidgetManifest
} from '@provoly/dashboard';
import { map, Observable } from 'rxjs';

let nextCompId = 0;

@Component({
  selector: 'pry-dataset-detail',
  templateUrl: './dataset-detail.component.html'
})
export class PryDatasetDetailComponent implements OnInit {
  @Input() dataset!: Dataset;
  @Output() goToCatalog = new EventEmitter();
  widgetManifest: WidgetManifest = {
    type: 'table',
    layout: { x: 1, y: 1, height: 10, width: 12 },
    options: {},
    datasource: ['']
  };
  protected readonly ViewMode = ViewMode;
  compId: number = 0;
  tab: number = 0;

  datasetItems$: Observable<ResultSets | null> | undefined;
  public datasetVersions$!: Observable<DatasetVersion[]>;
  showModalStatus: boolean = false;
  selectedDatasetVersion?: DatasetVersion;
  selectedMode: ViewMode = ViewMode.CONSULT;

  constructor(private store: Store) {
    this.compId = nextCompId++;
  }

  ngOnInit() {
    this.store.dispatch(SearchActions.getDatasourceItems({ id: this.dataset.id }));
    this.store.dispatch(DataSourceActions.dataset.listVersionsByDatasetId({ id: this.dataset.id }));
    this.datasetItems$ = this.store.select(DashboardSelectors.resultSets);
    this.datasetVersions$ = this.store
      .select(DataSourceSelectors.matchingDatasetVersions(this.dataset.id))
      .pipe(map((res) => [...res].sort((a, b) => b.version - a.version)));
    this.widgetManifest.datasource = [this.dataset.id];
  }

  goBack() {
    this.goToCatalog.emit();
  }

  goToConsult(version: DatasetVersion | undefined): void {
    this.selectedDatasetVersion = version;
    this.showModalStatus = false;
    this.selectedMode = ViewMode.CONSULT;
  }

  switch(number: number) {
    this.tab = number;
  }

  handleButtonAction(version: DatasetVersion) {
    this.selectedDatasetVersion = version;
    switch (version.state) {
      case 'ERROR':
        this.showModalStatus = true;
        break;
      case 'ACTIVE':
        this.deactivateVersion(version);
        break;
      case 'INACTIVE':
        this.activateVersion(version);
        break;
      default:
        break;
    }
  }

  private deactivateVersion(version: DatasetVersion) {
    this.store.dispatch(
      DataSourceActions.dataset.deactivateDatasetVersion({
        datasetId: this.dataset.id,
        versionId: version.id
      })
    );
  }

  private activateVersion(version: DatasetVersion) {
    this.store.dispatch(
      DataSourceActions.dataset.activateDatasetVersion({
        datasetId: this.dataset.id,
        versionId: version.id
      })
    );
  }
}
