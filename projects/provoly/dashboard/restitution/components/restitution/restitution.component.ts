import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CatalogEntry,
  Class,
  ClassActions,
  ClassSelectors,
  ConfigActions,
  DashboardActions,
  DataSource,
  DataSourceActions,
  DataSourceSelectors,
  DEFAULT_RESTITUTION_ICON_URL,
  FieldActions,
  getDisplayOptions,
  LibraryTypes,
  SearchActions,
  SubscriptionnerDirective,
  ToolboxManifestService,
  ToolboxMenuService,
  ViewMode,
  Widget,
  WidgetManifest
} from '@provoly/dashboard';
import { PryStepperComponent } from '@provoly/dashboard/components/stepper';
import { map, Observable, Subject } from 'rxjs';
import { v4 } from 'uuid';
import { RestitutionForm } from '../../model/restitution.model';

@Component({
  selector: 'pry-restitution',
  templateUrl: './restitution.component.html'
})
export class PryRestitutionComponent extends SubscriptionnerDirective implements OnInit {
  types$: Observable<{ icon: string; label: string; type: string; manifest: WidgetManifest }[]>;
  classes$: Observable<Class[]>;
  customManifest: WidgetManifest = {
    type: 'detail',
    layout: { x: 1, y: 1, width: 1, height: 1 },
    options: { itemIds: [] as string[] }
  };
  form: RestitutionForm = {
    selectedWidget: '',
    selectedDataSources: [],
    title: '',
    image: DEFAULT_RESTITUTION_ICON_URL,
    description: ''
  };
  groups: string[] = [];
  openSettings$: Subject<void> = new Subject<void>();
  consultMode: boolean = false;
  @Input() selectedRestitution: Widget | null = null;
  @Input() edit: boolean = true;
  @Output() restitutionCreated = new EventEmitter<void>();
  widgetsList$: Observable<CatalogEntry[]>;
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;
  @Input() isDataSourceSelected = false;
  @Input() bindId: any;
  image: string = DEFAULT_RESTITUTION_ICON_URL;
  widgetTypes: { icon: string; label: string; type: string; manifest: WidgetManifest }[] = [];
  usedDatasources$: Observable<DataSource[]>;
  activeStepIndex = 0;

  constructor(
    private toolboxManifestService: ToolboxManifestService,
    private store: Store,
    private toolboxMenuService: ToolboxMenuService
  ) {
    super();
    this.store.dispatch(DataSourceActions.load());
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(ConfigActions.loadCustomization());
    this.store.dispatch(FieldActions.load());

    this.types$ = this.toolboxMenuService.types$.pipe(
      map((type) => type.filter((filteredType) => filteredType.type !== 'detail'))
    );
    this.subscriptions.add(this.types$.subscribe((types) => (this.widgetTypes = types)));
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.widgetsList$ = this.toolboxMenuService.menuStructure$.pipe(
      map((menu) =>
        menu
          .map((items) => [...items.sub.filter((s) => this.toolboxManifestService.isModel(s.type))])
          .reduce((acc, items) => [...acc, ...items], [])
      )
    );
    this.usedDatasources$ = this.store
      .select(DataSourceSelectors.getDataSourcesSorted)
      .pipe(map((allDss) => allDss.filter((datasource) => this.form.selectedDataSources.includes(datasource.id))));
  }

  ngOnInit(): void {
    if (this.selectedRestitution) {
      if (!this.edit) {
        this.consultMode = true;
        this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: ViewMode.CONSULT }));
      } else {
        this.store.dispatch(
          DashboardActions.updateDisplayOptions({
            mode: ViewMode.CUSTOM,
            customDisplay: {
              ...getDisplayOptions(ViewMode.EDITION),
              widgetContextMenu: {
                datasourceSelection: false,
                parameters: true,
                window: false,
                maximize: false,
                addToCatalog: false,
                delete: false,
                changeSpot: false
              }
            }
          })
        );
      }
      this.customManifest = JSON.parse(this.selectedRestitution.content);
      if (Array.isArray(this.customManifest.datasource)) {
        this.customManifest.datasource.forEach((dataSource: string) => {
          this.store.dispatch(
            SearchActions.getDatasourceItems({
              id: dataSource,
              excludeGeo: this.customManifest.type === 'map',
              from: 'PryRestitutionComponent.ngOnInit()-1'
            })
          );
        });
      } else {
        this.store.dispatch(
          SearchActions.getDatasourceItems({
            id: this.customManifest.datasource as string,
            excludeGeo: this.customManifest.type === 'map',
            from: 'PryRestitutionComponent.ngOnInit()-2'
          })
        );
      }
      if (this.selectedRestitution.groups) {
        this.groups = this.selectedRestitution.groups;
      }
      this.form.selectedDataSources.forEach((dataSource: string) => {
        this.store.dispatch(
          SearchActions.getDatasourceItems({
            id: dataSource,
            excludeGeo: this.customManifest.type === 'map',
            from: 'PryRestitutionComponent.ngOnInit()-3'
          })
        );
      });
      this.customManifest = JSON.parse(this.selectedRestitution.content);
      this.form = {
        selectedWidget: this.customManifest.type,
        selectedDataSources: (this.customManifest.datasource ?? []) as string[],
        title: this.selectedRestitution.name,
        ...this.selectedRestitution
      };
    }
    this.image = this.selectedRestitution?.image ?? DEFAULT_RESTITUTION_ICON_URL;
  }

  cancel(stepper: PryStepperComponent) {
    this.form.selectedWidget = '';
    this.form.selectedDataSources = [];
    this.form.title = '';
    this.form.description = '';
    this.form.image = '';
    if (this.consultMode || this.selectedRestitution) {
      this.restitutionCreated.emit();
      return;
    }
    this.prev(stepper);
  }

  datasourcesChanged($event: DataSource[]) {
    this.form.selectedDataSources = ($event ?? []).map((ds) => ds.id);
  }

  submit(stepper: PryStepperComponent) {
    if (this.consultMode) {
      this.goNext(stepper);
      return;
    }

    const widgetType = this.widgetTypes.find((widgetType) => widgetType.type === this.form.selectedWidget);

    this.customManifest = {
      ...this.customManifest,
      type: this.form.selectedWidget,
      title: this.form.title,
      datasource: this.form.selectedDataSources ?? [],
      header: true,
      options: {
        ...widgetType?.manifest.options,
        title: this.form.title
      }
    };
    this.form.selectedDataSources.forEach((nameQuery: string) => {
      this.store.dispatch(
        SearchActions.getDatasourceItems({
          id: nameQuery,
          excludeGeo: this.customManifest.type === 'map',
          from: 'PryRestitutionComponent.submit()'
        })
      );
    });
    this.goNext(stepper);
    setTimeout(() => {
      this.openSettings$.next();
    }, 150);
  }

  goNext(stepper: PryStepperComponent, submit?: boolean) {
    submit ? this.submit(stepper) : stepper.next();
  }

  prev(stepper: PryStepperComponent) {
    stepper.prev();
  }

  updateManifest($event: { widgetIndex: number; manifest: WidgetManifest }) {
    this.customManifest = $event.manifest;
  }

  lastStepCompleted() {
    this.form.image = this.image;
    if (!this.consultMode) {
      this.store.dispatch(
        ConfigActions.saveWidget({
          widget: {
            id: this.selectedRestitution?.id ?? v4(),
            content: JSON.stringify(this.customManifest),
            name: this.form.title,
            description: this.form.description,
            image: this.form.image ?? '',
            groups: this.groups,
            datasource: this.form.selectedDataSources ?? [],
            modificationDate: ''
          }
        })
      );
    }
    this.store.dispatch(ConfigActions.loadWidgets());
    this.restitutionCreated.emit();
  }
}
