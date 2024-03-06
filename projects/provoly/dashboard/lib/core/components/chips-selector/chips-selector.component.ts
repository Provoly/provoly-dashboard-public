import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Dataset, NamedQuery } from '../../store/data-source/data-source.model';
import { DatasourceUtils } from '../../store/data-source/datasource-utils';
import { SubscriptionnerDirective } from '../../../dashboard/components/subscriptionner.directive';
import { PryI18nService } from '../../i18n/i18n.service';

@Component({
  selector: 'pry-chips-selector',
  templateUrl: './chips-selector.component.html'
})
export class ChipsSelectorComponent extends SubscriptionnerDirective {
  @Input() bindValue = '';
  @Input() bindLabel = '';
  @Input() translationStringBase = '';
  @Input() itemTranslationStringBase = '';
  @Input() showActionButtons = true;
  @Input() showSearchbar = true;

  @Input() set items(items: any[]) {
    this.items$.next(items);
  }

  @Input() set usedItems(items: any[]) {
    this.usedItems$.next(items);
  }

  @Output() cancel = new EventEmitter();
  @Output() validated = new EventEmitter();
  @Output() previousTab = new EventEmitter();
  @Output() nextTab = new EventEmitter();
  @Output() itemsChanged = new EventEmitter<any[]>();

  items$ = new BehaviorSubject<any[] | null>(null);
  usedItems$ = new BehaviorSubject<any[]>([]);
  unusedItems$: Observable<any[] | null>;
  search$ = new BehaviorSubject('');
  idToLabel: { [id: string]: string | undefined } = {};

  constructor(private cdr: ChangeDetectorRef, private i18n: PryI18nService) {
    super();

    this.unusedItems$ = combineLatest([this.items$, this.usedItems$, this.search$]).pipe(
      map(([items, usedItems, search]) => {
        return (
          items?.filter(
            (item) =>
              !this.isItemUsed(item, usedItems) && this.getItemLabel(item).toLowerCase().includes(search.toLowerCase())
          ) ?? []
        );
      })
    );
    this.subscriptions.add(
      this.items$.subscribe((items) =>
        items?.forEach((item) => (this.idToLabel[this.getItemValue(item)] = this.getItemLabel(item)))
      )
    );

    this.subscriptions.add(this.usedItems$.subscribe((usedItems) => this.itemsChanged.emit(usedItems ?? [])));
  }

  toggleItemSelection(item: any) {
    if (!this.isItemUsed(item)) {
      this.usedItems$.next([...this.usedItems$.getValue(), item]);
    } else {
      this.usedItems$.next(this.usedItems$.getValue().filter((usedItem) => !this.areItemsEqual(usedItem, item)));
    }
    this.cdr.detectChanges();
  }

  isGeo(item: any) {
    return typeof item === 'object'
      ? 'metadata' in item
        ? DatasourceUtils.isGeo(item as NamedQuery | Dataset)
        : false
      : false;
  }

  search($event: any) {
    this.search$.next($event);
    this.cdr.detectChanges();
  }

  getItemValue(item: any) {
    return this.bindValue ? item[this.bindValue] : item;
  }

  getItemLabel(item: any) {
    const label = this.bindLabel ? item[this.bindLabel] : item;
    const labelTranslated = this.itemTranslationStringBase
      ? this.i18n.instant(this.itemTranslationStringBase + label)
      : label;
    return typeof labelTranslated === 'string'
      ? labelTranslated.startsWith(this.itemTranslationStringBase)
        ? label
        : labelTranslated
      : '--object--';
  }

  areItemsEqual(item1: any, item2: any) {
    return this.getItemValue(item1) === this.getItemValue(item2);
  }

  isItemUsed(item: any, usedItems?: any[]) {
    return usedItems
      ? usedItems.find((usedItem) => this.areItemsEqual(usedItem, item))
      : this.usedItems$.getValue().find((usedItem) => this.areItemsEqual(usedItem, item));
  }
}
