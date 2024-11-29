import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Attribute,
  AttributeSimpleValue,
  BaseWidgetComponent,
  CategorySelectors,
  ClassSelectors,
  ContextMenuActions,
  DashboardActions,
  DashboardSelectors,
  DetailWidgetOptions,
  Field,
  FieldSelectors,
  FieldType,
  HeaderAction,
  Item,
  ItemUtils,
  PryI18nService,
  WidgetManifest
} from '@provoly/dashboard';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'pry-widget-detail',
  templateUrl: './widget-detail.component.html'
})
export class WidgetDetailComponent extends BaseWidgetComponent {
  options$: Observable<DetailWidgetOptions>;
  itemsToDisplay$: Observable<Item[]>;
  panelOpened: { item: boolean; categories: boolean[] }[] = [{ item: true, categories: [true] }];
  itemAndCategories$: Observable<
    { item: Item; categories: { id: string; name: string; properties: { name: string; attribute: Attribute }[] }[] }[]
  >;
  pinned$: Observable<boolean>;
  optionsCopy?: DetailWidgetOptions;
  itemsForPin?: string[];
  fields: Field[] = [];
  detailledWidgetManifest$: Observable<WidgetManifest>;
  additionalOptions$: Observable<HeaderAction[]>;
  widgetId: number;
  static widgetIdGenerator = 0;

  constructor(
    store: Store<any>,
    private translateService: PryI18nService,
    el: ElementRef
  ) {
    super(store, el);
    this.widgetId = WidgetDetailComponent.widgetIdGenerator++;
    this.options$ = this.manifest$.pipe(map((manifest) => (manifest.options ?? {}) as DetailWidgetOptions));
    this.pinned$ = this.options$.pipe(map((options) => !!options.itemIds && options.itemIds.length > 0));
    this.itemsToDisplay$ = combineLatest([
      this.store.select(DashboardSelectors.selectedItems),
      this.store.select(DashboardSelectors.allItems),
      this.options$,
      this.store.select(DashboardSelectors.objectDetails)
    ]).pipe(
      tap(([_, allItems, options, objectDetails]) => {
        // go search for detail item if not already found in allItems List
        if (options.itemIds && options.itemIds.length > 0) {
          const missingItems = options.itemIds
            .map((id) => (!allItems.find((it) => it.id === id) ? id : (null as unknown as string)))
            .filter((it) => !!it)
            .filter((it) => !Object.keys(objectDetails).includes(it));

          if (missingItems.length > 0) {
            this.store.dispatch(DashboardActions.fetchObjectsDetails({ ids: missingItems }));
          }
        }
      }),
      map(([globalSelectionItems, allItems, options, objectDetails]) =>
        options.itemIds && options.itemIds.length > 0
          ? options.itemIds.map((id) => allItems.find((it) => it.id === id) ?? objectDetails[id])
          : globalSelectionItems
      ),
      map((items) => items.filter((it) => !!it) as Item[])
    );

    this.itemAndCategories$ = combineLatest([
      this.itemsToDisplay$,
      this.store.select(ClassSelectors.classes),
      this.store.select(CategorySelectors.categories)
    ]).pipe(
      map(([items, classes, categories]) =>
        items.map((item) => {
          const objectClass = classes.find((oClass) => oClass.id === item.oClass) ?? { attributes: [] };
          const categoriesWithProps = [] as {
            id: string;
            properties: { name: string; attribute: Attribute }[];
            name: string;
          }[];
          objectClass.attributes.forEach((attr) => {
            const categoryId = attr.category ?? categories.find((cat) => cat.name === 'default')?.id ?? 'default-id';
            if (!categoriesWithProps.find((cat) => cat.id === categoryId)) {
              categoriesWithProps.push({
                id: categoryId,
                properties: [],
                name: categories.find((cat) => cat.id === categoryId)?.name ?? 'default'
              });
            }
            categoriesWithProps
              .find((cat) => cat.id === categoryId)
              ?.properties.push({ name: attr.name, attribute: attr });
          });
          return {
            item,
            categories: categoriesWithProps
          };
        })
      )
    );

    this.subscriptions.add(this.options$.subscribe((options) => (this.optionsCopy = structuredClone(options))));

    this.subscriptions.add(
      this.itemsToDisplay$.subscribe((items) => (this.itemsForPin = items.map((item) => item.id)))
    );

    this.subscriptions.add(this.store.select(FieldSelectors.fields).subscribe((fields) => (this.fields = fields)));

    this.detailledWidgetManifest$ = this.itemsToDisplay$.pipe(
      map(
        (items) =>
          ({
            ...this.manifest,
            title: this.translateService.instant('@pry.widget.detail.title', { itemsNb: items.length })
          }) as WidgetManifest
      )
    );

    this.additionalOptions$ = combineLatest([this.pinned$, this.itemsToDisplay$]).pipe(
      map(([isPinned, items]) => [
        {
          label: isPinned ? '@pry.widget.detail.unpin' : '@pry.widget.detail.pin',
          action: () => {
            this.togglePin();
          },
          icon: isPinned ? 'unpublished' : 'published_with_changes',
          disabled: () => items.length === 0
        }
      ])
    );
  }

  toggle(itemIndex: number, categoryIndex?: number) {
    if (!this.panelOpened[itemIndex]) {
      this.panelOpened[itemIndex] = { item: false, categories: [] };
    }
    if (categoryIndex === undefined) {
      this.panelOpened[itemIndex].item = !this.panelOpened[itemIndex].item;
    } else {
      this.panelOpened[itemIndex].categories[categoryIndex] = !this.panelOpened[itemIndex].categories[categoryIndex];
    }
  }

  getValue(item: Item, property: Attribute): AttributeSimpleValue[] {
    const value = ItemUtils.getAttributeValue(item, property);
    return Array.isArray(value) ? value : [value];
  }

  togglePin() {
    if (!this.optionsCopy) {
      this.optionsCopy = {};
    }
    if (!!this.optionsCopy.itemIds && this.optionsCopy.itemIds.length > 0) {
      delete this.optionsCopy.itemIds;
    } else {
      this.optionsCopy.itemIds = this.itemsForPin;
    }

    this.store.dispatch(
      DashboardActions.updateWidgetManifest({
        manifest: { ...this.manifest, options: this.optionsCopy },
        index: this.widgetIndex
      })
    );
  }

  hasMetadata(value: AttributeSimpleValue | Item) {
    return Object.keys(value?.metadata ?? {}).length > 0;
  }

  contextMenu($event: MouseEvent, item: Item) {
    if (this.manifest.contextMenu !== false) {
      $event.preventDefault();
      this.store.dispatch(
        ContextMenuActions.open({
          itemId: item.id,
          clientX: $event.clientX,
          clientY: $event.clientY,
          from: 'detail',
          allowObjectCreation: false
        })
      );
    }
  }

  isRaw(attribute: Attribute) {
    return attribute.field?.type === FieldType.RAW;
  }
}
