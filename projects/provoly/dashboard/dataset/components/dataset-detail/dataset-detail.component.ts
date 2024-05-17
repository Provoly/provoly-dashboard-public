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
  showModalStatus: boolean = false;
  selectedDatasetVersion?: DatasetVersion;
  selectedMode: ViewMode = ViewMode.CONSULT;
  activeVersion$!: Observable<DatasetVersion | undefined>;
  activeVersionId$!: Observable<string>;
  isEditingVersion = false;

  isPanelOpen: boolean = false;
  selectedVersion?: DatasetVersion;

  constructor(
    private store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) protected access: PryBaseAccess
  ) {
    super();
    this.datasetItems$ = this.store.select(DashboardSelectors.resultSets);
    this.compId = nextCompId++;
  }

  ngOnInit() {
    this.store.dispatch(DataSourceActions.dataset.listVersionsByDatasetId({ id: this.dataset.id }));
    this.store.dispatch(DashboardActions.removeFilters());
    this.store.dispatch(
      SearchActions.getDatasourceItems({
        id: this.dataset.id,
        excludeGeo: false,
        from: 'PryDatasetDetailComponent.ngOnInit()'
      })
    );

    this.datasetVersions$ = this.store
      .select(DataSourceSelectors.matchingDatasetVersions(this.dataset.id))
      .pipe(map((res) => [...res].sort((a, b) => b.version - a.version)));
    this.activeVersion$ = this.datasetVersions$.pipe(
      map((versions) =>
        versions.sort((v1, v2) => v2.version - v1.version).find((version) => version.state === 'ACTIVE')
      )
    );
    this.activeVersionId$ = this.activeVersion$.pipe(map((version) => version?.id ?? '-1'));

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
    this.store.dispatch(DataSourceActions.dataset.listVersions());
  }

  refresh() {
    this.store.dispatch(
      SearchActions.getDatasourceItems({
        id: this.dataset.id,
        excludeGeo: false,
        from: 'PryDatasetDetailComponent.refresh()'
      })
    );
    this.store.dispatch(DataSourceActions.dataset.listVersions());
  }

  goToConsult(version: DatasetVersion | undefined): void {
    this.selectedDatasetVersion = version;
    this.showModalStatus = false;
    this.selectedMode = ViewMode.CONSULT;
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
    this.selectedDatasetVersion = version;
    this.showModalStatus = true;
  }

  getVersionTooltipContent(version: DatasetVersion, activeVersionId: string) {
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

  canModify$() {
    return this.access ? this.access.canModifyDataset(this.dataset) : of(false);
  }
}
