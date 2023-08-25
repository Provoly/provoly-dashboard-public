import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CatalogEntry,
  Class,
  ClassActions,
  ClassSelectors,
  ConfigActions,
  DataSource,
  DataSourceActions,
  DEFAULT_RESTITUTION_ICON_URL,
  FieldActions,
  LibraryTypes,
  PryVisibility,
  PryVisibilityType,
  SearchActions,
  SubscriptionnerDirective,
  ToolboxManifestService,
  ToolboxMenuService,
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
  types$: Observable<{ icon: string; label: string; type: string }[]>;
  classes$: Observable<Class[]>;
  customManifest: WidgetManifest = {
    type: 'detail',
    layout: { x: 1, y: 1, width: 1, height: 1 },
    options: { itemIds: [] as string[] }
  };
  form: RestitutionForm = {
    selectedWidget: '',
    selectedDataSource: [],
    title: '',
    image: DEFAULT_RESTITUTION_ICON_URL,
    description: '',
    cover: false
  };
  visibility: PryVisibility = {
    type: PryVisibilityType.PRIVATE,
    users: []
  };
  openSettings$: Subject<void> = new Subject<void>();
  users$: Observable<any[]> | null = null;
  consultMode: boolean = false;
  @Input() selectedRestitution: Widget | null = null;
  @Input() edit: boolean = true;
  @Output() restitutionCreated = new EventEmitter<void>();
  widgetsList$: Observable<CatalogEntry[]>;
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;
  @Input() isDataSourceSelected = false;
  @Input() bindId: any;
  image: string = DEFAULT_RESTITUTION_ICON_URL;

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
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.widgetsList$ = this.toolboxMenuService.menuStructure$.pipe(
      map((menu) =>
        menu
          .map((items) => [...items.sub.filter((s) => this.toolboxManifestService.isModel(s.type))])
          .reduce((acc, items) => [...acc, ...items], [])
      )
    );
  }

  ngOnInit(): void {
    if (this.selectedRestitution) {
      if (!this.edit) {
        this.consultMode = true;
      }
      this.customManifest = JSON.parse(this.selectedRestitution.content);
      if (Array.isArray(this.customManifest.datasource)) {
        this.customManifest.datasource.forEach((dataSource: string) => {
          this.store.dispatch(SearchActions.getDatasourceItems({ id: dataSource }));
        });
      } else {
        this.store.dispatch(SearchActions.getDatasourceItems({ id: this.customManifest.datasource as string }));
      }
      if (this.selectedRestitution.visibility) {
        this.visibility = this.selectedRestitution.visibility;
      }
      this.form.selectedDataSource.forEach((dataSource: string) => {
        this.store.dispatch(SearchActions.getDatasourceItems({ id: dataSource }));
      });
      this.customManifest = JSON.parse(this.selectedRestitution.content);
      this.customManifest.header = {
        datasourceSelection: false,
        parameters: true,
        window: false,
        maximize: false,
        addToCatalog: false,
        delete: false,
        changeSpot: false
      };
      this.form = {
        selectedWidget: this.customManifest.type,
        selectedDataSource: this.customManifest.datasource as string[],
        title: this.selectedRestitution.name,
        cover: this.selectedRestitution.cover,
        ...this.selectedRestitution
      };
    }
    this.image = this.selectedRestitution?.image ?? DEFAULT_RESTITUTION_ICON_URL;
  }

  cancel(stepper: PryStepperComponent) {
    this.form.selectedWidget = '';
    this.form.selectedDataSource = [];
    this.form.title = '';
    this.form.description = '';
    this.form.image = '';
    this.form.cover = false;
    if (this.consultMode || this.selectedRestitution) {
      this.restitutionCreated.emit();
      return;
    }
    this.prev(stepper);
  }

  datasourcesChanged($event: DataSource[]) {
    this.form.selectedDataSource = $event.map((ds) => ds.id);
  }

  submit(stepper: PryStepperComponent) {
    if (this.consultMode) {
      this.goNext(stepper);
      return;
    }
    this.customManifest = {
      ...this.customManifest,
      type: this.form.selectedWidget,
      title: this.form.title,
      datasource: this.form.selectedDataSource,
      cover: this.form.cover ?? false,
      header: {
        datasourceSelection: false,
        parameters: true,
        window: false,
        maximize: false,
        addToCatalog: false,
        delete: false,
        changeSpot: false
      },
      options: {
        ...this.customManifest.options,
        title: this.form.title
      }
    };
    this.form.selectedDataSource.forEach((nameQuery: string) => {
      this.store.dispatch(SearchActions.getDatasourceItems({ id: nameQuery }));
    });
    this.goNext(stepper);
    setTimeout(() => {
      this.openSettings$.next();
    }, 150);
  }

  isSubmitDisabled() {
    return (
      this.form.selectedWidget === '' ||
      this.form.title.trim().length === 0 ||
      this.form.title.length > 30 ||
      this.form.description.length > 255
    );
  }

  noDataSourceSelected() {
    return this.form.selectedDataSource.length === 0;
  }

  goNext(stepper: PryStepperComponent) {
    stepper.next();
  }

  prev(stepper: PryStepperComponent) {
    stepper.prev();
  }

  updateManifest($event: { widgetIndex: number; manifest: WidgetManifest }) {
    this.customManifest = $event.manifest;
  }

  lastStepCompleted() {
    this.form.image = this.image;
    if (this.edit) {
      this.store.dispatch(
        ConfigActions.saveWidget({
          widget: {
            id: this.selectedRestitution?.id ?? v4(),
            content: JSON.stringify(this.customManifest),
            name: this.form.title,
            description: this.form.description,
            image: this.form.image ?? '',
            visibility: this.visibility,
            datasource: this.form.selectedDataSource,
            cover: this.form.cover ?? false,
            modificationDate: ''
          }
        })
      );
    }
    this.store.dispatch(ConfigActions.loadWidgets());
    this.restitutionCreated.emit();
  }
}
