import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AttributeSimpleValue,
  Class,
  ClassSelectors,
  ConfigSelectors,
  ContextMenuActions,
  DashboardActions,
  DashboardSelectors,
  DataWidgetComponent,
  Field,
  FieldSelectors,
  FieldType,
  Item,
  ItemUtils,
  ResultSet,
  TileWidgetOptions,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'pry-widget-tile',
  templateUrl: './widget-tile.component.html'
})
export class WidgetTileComponent extends DataWidgetComponent {
  options$: Observable<TileWidgetOptions>;
  items$: Observable<Item[]>;
  selectedIds$: Observable<any>;
  maps: boolean[] = [];
  mapManifest = {
    type: 'map',
    header: false,
    layout: { x: 1, y: 1, width: 1, height: 1 },
    options: { layers: [{ type: 'marker' }], fit: true }
  };
  classes$: Observable<Class[]>;
  optionsCopy: TileWidgetOptions = {};
  WIDGET_HEADER_HEIGHT = WIDGET_HEADER_HEIGHT;
  propertiesToDisplay$: Observable<{ [p: string]: { label: string; prop: string; field: Field }[] } | undefined>;
  fields: Field[] = [];
  classes: Class[] = [];

  constructor(store: Store<any>, el: ElementRef) {
    super(store, el);
    this.options$ = this.manifest$.pipe(map((manifest) => manifest.options as TileWidgetOptions));
    this.subscriptions.add(
      this.options$.pipe(filter((opt) => !!opt)).subscribe((options) => {
        this.optionsCopy = { ...(JSON.parse(JSON.stringify(options)) as TileWidgetOptions) };
      })
    );
    this.items$ = combineLatest([
      this.resultSet$.pipe(map((rs) => Object.values(rs.items).reduce((p, c) => [...p, ...c], []))),
      this.options$
    ]).pipe(
      map(([items, options]) =>
        items.filter(
          (item) => !options.classes || options.classes.length === 0 || options.classes.includes(item.oClass)
        )
      )
    );
    this.selectedIds$ = this.store.select(DashboardSelectors.selectedItemIds);
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.propertiesToDisplay$ = combineLatest([
      this.classes$,
      this.store.select(ConfigSelectors.tileAttributesDefinitions),
      this.store.select(ConfigSelectors.maxAttributesInTiles)
    ]).pipe(
      map(([classes, tileDefs, maxTilesAttributes]) => ({
        ...classes
          .map((clazz) => ({
            [clazz.id]: [
              ...clazz.attributes
                .map((attr) => ({
                  label: attr.name,
                  prop: attr.technicalName,
                  field: attr.field
                }))
                .filter((_, i) => i < maxTilesAttributes)
            ]
          }))
          .reduce((p, c) => ({ ...p, ...c }), {}),
        ...classes
          .filter((clazz) => !!tileDefs[clazz.id])
          .map((clazz) => ({
            [clazz.id]: [
              ...clazz.attributes
                .filter((attr) => tileDefs[clazz.id].includes(attr.name))
                .map((attr) => ({
                  label: attr.name,
                  prop: attr.technicalName,
                  field: attr.field
                }))
            ]
          }))
          .reduce((p, c) => ({ ...p, ...c }), {})
      }))
    );
    this.subscriptions.add(this.store.select(FieldSelectors.fields).subscribe((fields) => (this.fields = fields)));
    this.subscriptions.add(this.classes$.subscribe((classes) => (this.classes = classes)));
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
          from: 'tile',
          allowObjectCreation: false
        })
      );
    }
  }

  select($event: MouseEvent, item: Item) {
    $event.stopPropagation();
    $event.preventDefault();
    this.store.dispatch(DashboardActions.select({ id: item.id, cumulative: !$event.shiftKey }));
  }

  toggleMap(index: number) {
    this.maps[index] = !this.maps[index];
  }

  resultSetWithItem(item: Item): ResultSet {
    return { items: { [item.oClass]: [item] }, relations: [] };
  }

  emitManifest() {
    this.manifestModified.emit({
      widgetIndex: this.widgetIndex,
      manifest: {
        ...this.manifest,
        options: this.optionsCopy
      }
    });
  }

  changeClasses($event: any) {
    this.optionsCopy.classes = $event;
  }

  getValue(item: Item, property: string): AttributeSimpleValue[] {
    const value = ItemUtils.getAttributeValue(item, property);
    return Array.isArray(value) ? value : [value];
  }

  isRaw(property: string, classId: string): boolean {
    const clazz = this.classes.find((clazz) => clazz.id === classId);
    const prop = clazz?.attributes.find((attr) => attr.name === property);
    return prop?.field.type === FieldType.RAW ?? false;
  }

  hasMetadata(value: AttributeSimpleValue | Item) {
    return Object.keys(value?.metadata ?? {}).length > 0;
  }
}
