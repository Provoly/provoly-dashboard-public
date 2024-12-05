import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Inject, Injector, Input, Optional, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassSelectors,
  ConfigActions,
  DashboardActions,
  DashboardSelectors,
  DataSource,
  DataSourceSelectors,
  FieldSelectors,
  FieldType,
  Filter,
  FilterFactoryService,
  GlobalManifest,
  MonoClassSearchPayload,
  NamedQueryTypes,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  PryI18nService
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs';
import { v4 } from 'uuid';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';

export enum FilterSteps {
  LIST = 'list',
  CREATION = 'creation',
  EDITION = 'edition'
}

export interface Attribute {
  id: string;
  customId: string;
  technicalName: string;
  label: string;
  datasource: string;
  type: FieldType;
}

@Component({
  selector: 'pry-filter-settings',
  templateUrl: './filter-settings.component.html'
})
export class PryFilterSettingsComponent extends ToolboxActionComponent {
  @Input() label = true;
  @ViewChild('settings', { read: TemplateRef }) templateSettings!: TemplateRef<any>;
  overlayRefSettings?: OverlayRef;
  settingsOpened: boolean = false;
  manifest$: Observable<GlobalManifest>;
  filters: Filter[] = [];
  types$: Observable<{ label: string; value: string }[]>;
  currentFilterComponentType$ = new BehaviorSubject('');
  currentStep: FilterSteps = FilterSteps.LIST;
  steps = FilterSteps;
  filter: Filter = {
    id: v4(),
    name: '',
    type: '',
    attributes: []
  };
  datasource$: Observable<any>;
  operators = [
    { label: '@pry.search.operator.equalsString', value: 'EQUALS' },
    { label: '@pry.search.operator.notEqualsString', value: 'NOT_EQUALS' },
    { label: '@pry.search.operator.contains', value: 'CONTAINS' },
    { label: '@pry.search.operator.containsCaseInsensitive', value: 'I_CONTAINS' },
    { label: '@pry.search.operator.startWith', value: 'START_WITH' },
    { label: '@pry.search.operator.endWith', value: 'END_WITH' },
    { label: '@pry.search.operator.greaterThanNumber', value: 'GREATER_THAN' },
    { label: '@pry.search.operator.lowerThanNumber', value: 'LOWER_THAN' },
    { label: '@pry.search.operator.innerBoundsDate', value: 'INSIDE' },
    { label: '@pry.search.operator.outerBoundsDate', value: 'OUTSIDE' }
  ];
  currentOperators$ = new BehaviorSubject(this.operators);
  classes: Class[] = [];
  attributes$: Observable<Attribute[]>;
  selectedAttribute$ = new BehaviorSubject<string[]>(this.filter.attributes.map((attr) => attr.id));
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  attributes: Attribute[] = [];

  constructor(
    store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private filterFactoryService: FilterFactoryService,
    private injector: Injector,
    private i18nService: PryI18nService
  ) {
    super(store, access);
    this.manifest$ = store.select(DashboardSelectors.globalManifest);
    this.subscriptions.add(
      this.manifest$.subscribe((manifest) => {
        this.filters = manifest.filters ? [...manifest.filters] : [];
      })
    );

    this.datasource$ = combineLatest([
      this.store.select(DataSourceSelectors.getDataSources),
      store.select(DashboardSelectors.namedQueriesUses)
    ]).pipe(
      map(([dataSources, dataSourcesUsed]) =>
        Object.keys(dataSourcesUsed).map((id) => ({
          label: dataSources.find((dataSource) => dataSource.id === id)?.name,
          value: id
        }))
      )
    );

    this.types$ = this.filterFactoryService.types$.pipe(
      map((types) =>
        types.map((type) => ({
          label: '@pry.filters.types.' + type,
          value: type
        }))
      )
    );

    this.subscriptions.add(
      this.currentFilterComponentType$.subscribe(() => {
        this.currentOperators$.next(this.getOperators());
      })
    );

    this.attributes$ = combineLatest([
      store.select(DataSourceSelectors.getDataSources),
      store.select(DashboardSelectors.namedQueriesUses),
      store.select(ClassSelectors.classes),
      this.currentFilterComponentType$
    ]).pipe(
      withLatestFrom(store.select(FieldSelectors.fields)),
      map(([[dataSources, currentDataSources, classes, componentType], fields]) => {
        let dataSourcesInPres = dataSources.filter((dataSource) =>
          Object.keys(currentDataSources).includes(dataSource.id) ? dataSource : false
        );
        return dataSourcesInPres
          .map((dataSource) =>
            (this.getDatasourceClass(dataSource, classes)?.attributes ?? []).map((attr) => ({
              id: attr.id,
              customId: this.getCustomAttributeId(attr.id, dataSource.id),
              technicalName: attr.technicalName,
              label: `${attr.name} / ${dataSource.name}`,
              datasource: dataSource.id,
              type: attr.field.type ?? FieldType.STRING
            }))
          )
          .flat()
          .sort((attr1, attr2) => attr1.label.localeCompare(attr2.label))
          .filter((attr) => this.isValidAttributeForComponentType(componentType, attr));
      }),
      map(
        (attributes) =>
          [
            ...attributes,
            ...this.filter.attributes
              .map((attr) =>
                attributes.map((a) => a.id).includes(attr.id)
                  ? undefined
                  : {
                      ...attr,
                      label: `${this.i18nService.instant('@pry.toolbox.notInDsAttr')} - ${attr.label}`,
                      classes: '-warn'
                    }
              )
              .filter((attr) => !!attr)
          ] as Attribute[]
      )
    );

    this.subscriptions.add(this.attributes$.subscribe((attrs) => (this.attributes = attrs)));
  }

  getDatasourceClass(dataSource: DataSource, classes: Class[]): Class | undefined {
    let clazz: Class | undefined = undefined;
    if (dataSource.sourceType === 'dataset') {
      clazz = classes.find((clazz) => clazz.id === dataSource.oClass);
    } else if (
      dataSource.sourceType === 'namedQuery' &&
      dataSource.request &&
      dataSource.request.type === NamedQueryTypes.MONO_CLASS
    ) {
      clazz = classes.find((clazz) => clazz.id === (dataSource.request as MonoClassSearchPayload).oClass);
    }
    return clazz;
  }

  isValidAttributeForComponentType(componentType: string, attribute: Attribute): boolean {
    switch (componentType) {
      case 'date':
        return attribute.type === FieldType.INSTANT;
      case 'number':
        return [FieldType.INTEGER, FieldType.DECIMAL, FieldType.LONG].includes(attribute.type);
      case 'text':
        return [FieldType.STRING, FieldType.KEYWORD].includes(attribute.type);
      case 'autocomplete':
        return [FieldType.KEYWORD].includes(attribute.type);
      default:
        return true;
    }
  }

  drop(event: CdkDragDrop<Filter[]>) {
    moveItemInArray(this.filters, event.previousIndex, event.currentIndex);
  }

  toggleSettings() {
    this.settingsOpened = !this.settingsOpened;
    if (this.settingsOpened) {
      this.openSettings();
    } else {
      this.overlayRefSettings?.dispose();
      this.overlayRefSettings = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.store.dispatch(DashboardActions.setFilters({ filters: this.filters }));
      this.goBack();
      this.close();
    }
  }

  openSettings() {
    this.overlayRefSettings = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['o-modal-wrapper', 'o-select-grid-layout-modal-wrapper'],
        backdropClass: 'backdrop--with-color'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRefSettings.backdropClick().subscribe((_) => {
      this.goBack();
      this.toggleSettings();
    });
    this.overlayRefSettings.attach(new TemplatePortal(this.templateSettings, this.viewContainerRef));
  }

  updateFilterType($event: any) {
    this.filter.type = $event;
    switch ($event) {
      case 'list':
      case 'autocomplete':
        this.filter.operator = 'EQUALS';
        break;
      case 'text':
        this.filter.operator = 'I_CONTAINS';
        break;
      default:
        break;
    }
    if (this.filter.type !== '' && this.container) {
      let component = this.filterFactoryService.generateFilter(this.filter.type, this.injector, this.container);
      this.subscriptions.add(
        component.subscribe((componentRef) => {
          this.currentFilterComponentType$.next(componentRef.instance.type);
        })
      );
    }
    this.filter.limit = this.filter.type === 'autocomplete' ? this.filter.limit ?? 10 : undefined;
  }

  getFilterAttributes(filter: Filter, attrCount: number) {
    attrCount = attrCount <= filter.attributes.length ? attrCount : filter.attributes.length;
    return filter.attributes
      .map((attr) => attr.technicalName)
      .slice(0, attrCount)
      .join(', ');
  }

  goBack() {
    this.filter = {
      id: v4(),
      name: '',
      type: '',
      attributes: []
    };
    this.currentStep = FilterSteps.LIST;
  }

  goToEdition(filter: Filter) {
    this.filter = {
      ...filter,
      attributes: [
        ...filter.attributes.map((attr) => ({ ...attr, customId: this.getCustomAttributeId(attr.id, attr.datasource) }))
      ]
    };
    this.currentStep = FilterSteps.EDITION;
  }

  goToCreation() {
    this.currentFilterComponentType$.next('');
    this.currentStep = FilterSteps.CREATION;
  }

  submitFilter() {
    this.filter.attributes = this.filter.attributes.map((attr) =>
      typeof attr === 'string' ? this.attributes.find((attrObj) => attrObj.customId === attr)! : attr
    );
    this.store.dispatch(DashboardActions.updateFilters({ filter: this.filter }));
    this.goBack();
  }

  selectAttribute($event: Attribute[]) {
    this.filter.attributes = $event;
    this.selectedAttribute$.next($event.map((attr) => attr.id));
  }

  deleteFilter(id: string) {
    this.store.dispatch(DashboardActions.removeFilter({ id }));
  }

  getOperators(): { label: string; value: string }[] {
    return this.operators.filter((operator) => {
      switch (this.currentFilterComponentType$.value) {
        case 'date':
          return this.filter.hasDateRange
            ? ['INSIDE', 'OUTSIDE'].includes(operator.value)
            : ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LOWER_THAN'].includes(operator.value);
        case 'list':
        case 'autocomplete':
          return ['EQUALS'].includes(operator.value);
        case 'number':
          return ['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LOWER_THAN'].includes(operator.value);
        case 'text':
          return ['I_CONTAINS', 'CONTAINS', 'EQUALS', 'NOT_EQUALS', 'START_WITH', 'END_WITH'].includes(operator.value);
        default:
          return operator;
      }
    });
  }

  getCustomAttributeId(attributeId: string, datasetId: string): string {
    return `${attributeId}@${datasetId}`;
  }

  protected readonly FilterSteps = FilterSteps;
}
