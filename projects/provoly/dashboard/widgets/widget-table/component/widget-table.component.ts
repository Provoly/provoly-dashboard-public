import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  baseItemProperties,
  Class,
  ClassActions,
  ClassSelectors,
  ColumnDefinition,
  ConfigSelectors,
  ContextMenuActions,
  ContextMenuSelectors,
  DashboardActions,
  DashboardSelectors,
  DataWidgetComponent,
  Field,
  FieldSelectors,
  FieldType,
  Item,
  ItemUtils,
  OrderValue,
  ResultOrder,
  SearchSelectors,
  TableWidgetOptions,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import equal from 'fast-deep-equal/es6';
import { auditTime, BehaviorSubject, combineLatest, Observable, take } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

export interface Pagination {
  totalPages: number;
  page: number;
  rows: number;
  items: Item[];
  loaded: number;
  loadedPages: number;
  noFillersItems: number;
}

@Component({
  selector: 'pry-widget-table',
  templateUrl: './widget-table.component.html'
})
export class WidgetTableComponent extends DataWidgetComponent {
  options$: Observable<TableWidgetOptions>;
  columns$: Observable<ColumnDefinition[]>;
  optionsCopy?: TableWidgetOptions;
  fields$: Observable<Field[]>;
  selectedIds$: Observable<string[]>;
  Array = Array;
  currentClasses: string[] = [];
  selectedIds: string[] = [];
  WIDGET_HEADER_HEIGHT = WIDGET_HEADER_HEIGHT;
  private classes$: Observable<Class[]>;
  properties$: Observable<{ label: string; property: string }[]>;
  isLoading$: Observable<boolean>;
  allSelected$: Observable<boolean>;
  areAllSelected: boolean = false;
  allIds: string[] = [];
  contextMenuClickedId: string = '';
  isContextMenuOpened$: Observable<boolean>;
  quickOrder$: Observable<ResultOrder | undefined>;
  private _refresh$ = new BehaviorSubject<void>(undefined);
  actualPage$ = new BehaviorSubject<number>(0);
  pagination$: Observable<Pagination>;
  isOpen = false;

  constructor(store: Store<any>, el: ElementRef, private cdr: ChangeDetectorRef) {
    super(store, el);

    this.classes$ = this.store.select(ClassSelectors.classes);

    this.fields$ = combineLatest([this.resultSet$, this.classes$, this.store.select(FieldSelectors.fields)]).pipe(
      map(
        ([resultSet, classes, fields]) =>
          [
            ...ItemUtils.getFieldsFromAvailabilityInResultSet(resultSet, classes, fields),
            ...baseItemProperties.map((p) => ({ name: p, id: p } as Field))
          ] as Field[]
      ),
      map((fields) => fields.filter((field) => field.type !== FieldType.RAW))
    );

    this.options$ = combineLatest([
      this.manifest$.pipe(map((manifest) => manifest.options as TableWidgetOptions)),
      this.resultSet$,
      this.classes$,
      this.fields$,
      this.store.select(ConfigSelectors.tableDefaultAttributesDefinitions)
    ]).pipe(
      map(([options, resultSet, classes, fields, defs]) => {
        if (!options.columns || options.columns.length === 0) {
          const attributes = ItemUtils.getAttributesFromRs(resultSet, classes, fields, defs);
          const uniqueProps = [...new Set(attributes.map((attr) => attr.name))];

          options.columns = uniqueProps.map((property) => ({
            property: property,
            label: property,
            attributeId: attributes.find((attr) => attr.name === property)?.id
          })) as ColumnDefinition[];
        }
        return options;
      })
    );

    this.subscriptions.add(
      this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
        this.optionsCopy = { ...(JSON.parse(JSON.stringify(options)) as TableWidgetOptions) };
        this.refresh();
      })
    );

    this.subscriptions.add(this.allItems$.subscribe((allObjects) => (this.allIds = allObjects.map((obj) => obj.id))));

    this.isLoading$ = combineLatest([store.select(SearchSelectors.searchLoading), this.datasourceIds$]).pipe(
      map(([searchLoading, datasourceIds]) => {
        return (searchLoading ?? []).filter((id) => (datasourceIds ?? []).includes(id))?.length > 0;
      })
    );

    const HEADER_SIZE = 60;
    const PAGINATION_SIZE = 35;
    const LINE_SIZE = 45;

    this.pagination$ = combineLatest([
      this.allItems$,
      this.actualPage$,
      this.widgetSize$,
      this.resultSet$,
      this.displayHeader$
    ]).pipe(
      map(([items, actualPage, size, rs, headerPresent]) => {
        const rows = Math.max(
          1,
          Math.floor(
            (size.height - HEADER_SIZE - PAGINATION_SIZE - (headerPresent ? WIDGET_HEADER_HEIGHT : 0)) / LINE_SIZE
          )
        );
        const total = Object.values(rs.count ?? {}).reduce((p, c) => c.count + p, 0);
        const loadedPages = Math.ceil(items.length / rows);
        const page = actualPage <= loadedPages ? actualPage : Math.max(0, loadedPages - 1);
        const filtered = items.filter((_, idx) => idx >= rows * page && idx < rows * (page + 1));
        const filteredWithFillers =
          filtered.length === rows
            ? filtered
            : filtered.concat(
                new Array(rows - filtered.length).fill({
                  metadata: { '__widget-table-filler': true }
                } as unknown as Item)
              );
        return {
          rows,
          page,
          items: filteredWithFillers,
          noFillersItems: filtered.length,
          total,
          totalPages: Math.ceil(total / rows),
          loaded: items.length,
          loadedPages
        };
      })
    );

    this.subscriptions.add(this.pagination$.pipe(auditTime(200)).subscribe(() => this.refresh()));

    this.columns$ = this.options$.pipe(
      map((options) => options?.columns ?? []),
      tap(() => setTimeout(() => this.refresh(), 500))
    );

    this.isContextMenuOpened$ = this.store.select(ContextMenuSelectors.opened);

    this.subscriptions.add(
      this.resultSet$
        .pipe(
          filter((rs) => !!rs),
          map((rs) => Object.keys(rs.items))
        )
        .subscribe((classes) => {
          if (this.currentClasses.length > 0 && !equal(this.currentClasses, classes)) {
            if (!this.optionsCopy) {
              this.optionsCopy = {};
            }
            delete this.optionsCopy.columns;
            this.emitManifest();
          }
          this.currentClasses = classes;
        })
    );

    this.selectedIds$ = this.store.select(DashboardSelectors.selectedItemIds);

    this.subscriptions.add(this.selectedIds$.subscribe((selectedIds) => this.selectedIds === selectedIds));

    this.store.dispatch(ClassActions.load());

    this.properties$ = this.resultSet$.pipe(
      map((rs) => [...ItemUtils.getAttributesFromAvailabilityInResultSet(rs)]),
      map((props) => {
        const sortedProps = [...props];
        sortedProps.sort((pA, pB) => pA.toLocaleLowerCase().localeCompare(pB.toLocaleLowerCase()));
        return sortedProps;
      }),
      map((props) => props.map((prop) => ({ label: prop, property: prop }))),
      tap(() => setTimeout(() => this.refresh(), 500))
    );

    this.allSelected$ = combineLatest([this.selectedIds$, this.allItems$]).pipe(
      map(([selectedIds, allObjects]) => {
        const allIds = allObjects.map((object) => object.id);
        return !allIds.find((id) => !selectedIds.includes(id));
      }),
      tap((allSelected) => (this.areAllSelected = allSelected))
    );

    this.quickOrder$ = combineLatest([this.store.select(DashboardSelectors.quickOrder), this.datasourceIds$]).pipe(
      map(([order, nqs]) => (nqs.length === 1 ? order[nqs[0]] : undefined))
    );

    this.subscriptions.add(this._refresh$.subscribe(() => this.cdr.detectChanges()));
  }

  refresh() {
    this._refresh$.next();
    this.isOpen = !this.isOpen;
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: { ...this.manifest, options: this.optionsCopy }
    });
  }

  addColumn() {
    if (!this.optionsCopy?.columns) {
      this.optionsCopy = { columns: [] };
    }
    this.optionsCopy.columns?.push({ label: '', property: '' });
    this.refresh();
  }

  changePropertyName($event: any, columnDef: ColumnDefinition) {
    columnDef.property = $event;
    this.refresh();
  }

  changeLabel($event: Event, columnDef: ColumnDefinition) {
    // @ts-ignore
    const newLabel = $event.currentTarget.value;
    if (columnDef.label !== newLabel) {
      columnDef.label = newLabel;
      this.refresh();
    }
  }

  deleteColumn(i: number) {
    this.optionsCopy?.columns?.splice(i, 1);
    this.refresh();
  }

  selection($event: MouseEvent, item: Item) {
    this.store.dispatch(DashboardActions.select({ id: item.id, cumulative: !$event.shiftKey }));
    $event.preventDefault();
    $event.stopPropagation();
  }

  contextMenu($event: MouseEvent, item: Item) {
    if (this.manifest.contextMenu !== false) {
      $event.stopPropagation();
      $event.preventDefault();
      this.store.dispatch(
        ContextMenuActions.open({
          itemId: item.id,
          clientX: $event.clientX,
          clientY: $event.clientY,
          resultSet: Array.isArray(this.manifest.datasource) ? this.manifest.datasource[0] : this.manifest.datasource,
          from: 'table',
          allowObjectCreation: false
        })
      );
      this.contextMenuClickedId = item.id;
    }
  }

  invertLayers(idx: number, idxWith: number) {
    if (!!this.optionsCopy && !!this.optionsCopy.columns) {
      const tmp = this.optionsCopy.columns[idxWith];
      this.optionsCopy.columns[idxWith] = this.optionsCopy.columns[idx];
      this.optionsCopy.columns[idx] = tmp;
      this.refresh();
    }
  }

  selectAll($event: any) {
    if ($event) {
      this.store.dispatch(DashboardActions.selectMany({ ids: this.allIds }));
    } else {
      this.store.dispatch(DashboardActions.selectMany({ ids: [] }));
    }
  }

  setOrder(column: ColumnDefinition) {
    this.datasourceIds$
      .pipe(
        take(1),
        filter((nqs) => nqs.length === 1),
        withLatestFrom(this.quickOrder$)
      )
      .subscribe(([nqs, actualOrder]) => {
        this.store.dispatch(
          DashboardActions.quickOrder({
            datasourceId: nqs[0],
            attribute: column.attributeId ?? '',
            asc: this.nextOrder(column, actualOrder)
          })
        );
      });
  }

  private nextOrder(column: ColumnDefinition, actualOrder: ResultOrder | undefined): OrderValue {
    if (!actualOrder || actualOrder.attribute !== column.attributeId) {
      return 'asc';
    }
    return actualOrder.asc === 'asc' ? 'desc' : actualOrder.asc === 'desc' ? undefined : 'asc';
  }

  trackObjects(index: number, item: Item) {
    return item.id;
  }

  goToPage(number: number) {
    this.actualPage$.next(number);
  }
}
