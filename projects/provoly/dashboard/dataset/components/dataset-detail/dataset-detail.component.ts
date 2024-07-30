import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  Dataset,
  DatasetVersion,
  DataSourceActions,
  DataSourceSelectors,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  PryDialogService,
  PryStatusModalComponent,
  ResultSets,
  SearchActions,
  SubscriptionnerDirective,
  ViewMode,
  WidgetManifest
} from '@provoly/dashboard';
import { map, Observable, of } from 'rxjs';

let nextCompId = 0;

@Component({
  selector: 'pry-dataset-detail',
  templateUrl: './dataset-detail.component.html'
})
export class PryDatasetDetailComponent extends SubscriptionnerDirective implements OnInit {
  @Input() dataset!: Dataset;
  @Output() goToCatalog = new EventEmitter();
  widgetManifest = {
    table: {
      header: true,
      type: 'table',
      layout: { x: 1, y: 1, height: 12, width: 12 },
      options: {},
      datasource: ['']
    },
    map: {
      header: false,
      type: 'map',
      layout: { x: 1, y: 1, height: 12, width: 12 },
      options: {
        layers: [],
        fit: true,
        automaticLayers: true
      },
      datasource: ['']
    }
  } as { [key: string]: WidgetManifest };
  protected readonly ViewMode = ViewMode;
  compId: number = 0;
  tab: number = 0;
  datasetItems$: Observable<ResultSets | null>;
  public datasetVersions$!: Observable<DatasetVersion[]>;
  selectedDatasetVersion?: DatasetVersion;
  selectedMode: ViewMode = ViewMode.CONSULT;
  isEditingVersion = false;
  canModify$!: Observable<boolean>;
  currentDataset$!: Observable<Dataset | undefined>;

  isPanelOpen: boolean = false;
  selectedVersion?: DatasetVersion;

  constructor(
    private store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) protected access: PryBaseAccess,
    private dialog: PryDialogService
  ) {
    super();
    this.datasetItems$ = this.store.select(DashboardSelectors.resultSets);
    this.compId = nextCompId++;
    this.subscriptions.add(
      this.store.select(DashboardSelectors.dashboardEditionMode).subscribe((editionMode) => {
        if (editionMode) this.store.dispatch(DashboardActions.toggleEditionMode({}));
      })
    );
  }

  ngOnInit() {
    this.canModify$ = this.access?.canModifyDataset(this.dataset) ?? of(false);
    this.store.dispatch(DataSourceActions.dataset.listVersionsByDatasetId({ id: this.dataset.id }));
    this.store.dispatch(DashboardActions.removeFilters());
    this.store.dispatch(
      SearchActions.getDatasourceItems({
        id: this.dataset.id,
        excludeGeo: false,
        from: 'PryDatasetDetailComponent.ngOnInit()'
      })
    );

    this.currentDataset$ = this.store
      .select(DataSourceSelectors.datasets)
      .pipe(map((datasets) => datasets.find((currentDataset) => currentDataset.id === this.dataset.id)));
    this.datasetVersions$ = this.store.select(DataSourceSelectors.datasetVersions);
    this.subscriptions.add(
      this.datasetVersions$.subscribe((versions) => {
        if (this.selectedVersion) {
          this.selectedVersion = {
            ...this.selectedVersion,
            ...versions.find((version) => version.id === this.selectedVersion?.id)
          };
        }
      })
    );

    this.widgetManifest['table'].datasource = [this.dataset.id];
    this.widgetManifest['map'].datasource = [this.dataset.id];
  }

  goBack() {
    this.goToCatalog.emit();
    this.store.dispatch(DataSourceActions.dataset.listVersions({}));
  }

  refresh() {
    this.store.dispatch(
      SearchActions.getDatasourceItems({
        id: this.dataset.id,
        excludeGeo: false,
        from: 'PryDatasetDetailComponent.refresh()'
      })
    );
    this.store.dispatch(DataSourceActions.dataset.loadDataset());
    this.store.dispatch(DataSourceActions.dataset.listVersionsByDatasetId({ id: this.dataset.id }));
  }

  switch(number: number) {
    this.tab = number;
  }

  handleButtonAction($event: Event, version: DatasetVersion) {
    $event.preventDefault();
    $event.stopPropagation();
    this.selectedDatasetVersion = version;
    switch (version.state) {
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

  consultErrors($event: Event, version: DatasetVersion) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dialog.open(PryStatusModalComponent, { data: { version: version } });
  }

  getVersionTooltipContent(version: DatasetVersion, activeVersionId?: string) {
    switch (version.state) {
      case 'ERROR':
        return 'error';
      case 'ACTIVE':
        return version.id === activeVersionId ? 'active' : 'inactive';
      case 'LOADING':
      case 'INDEXING':
        return 'loading';
      case 'INACTIVE':
        return 'invalid';
      default:
        return 'unknown';
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

  onTabSwitch($event: number) {
    if ([0, 1, 2].includes($event)) {
      this.isPanelOpen = false;
    }
  }

  togglePanel(selectedVersion?: DatasetVersion) {
    if (selectedVersion) {
      this.selectedVersion = selectedVersion;
      this.isPanelOpen = true;
      this.isEditingVersion = false;
    } else {
      this.isPanelOpen = !this.isPanelOpen;
      this.selectedVersion = undefined;
    }
  }

  editVersion() {
    this.isEditingVersion = true;
  }

  formValidated($event: Partial<DatasetVersion>) {
    this.isEditingVersion = false;
  }

  askDelete(version: DatasetVersion, $event?: Event) {
    this.store.dispatch(DataSourceActions.dataset.confirmDeleteVersion({ version }));
    $event?.stopPropagation();
  }
}
