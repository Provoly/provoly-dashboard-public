import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import equal from 'fast-deep-equal/es6';
import { SubscriptionnerDirective } from '../../../dashboard/components/subscriptionner.directive';

let uniqueId = 0;

@Component({
  selector: 'pry-select',
  templateUrl: './select.component.html',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrySelectComponent),
      multi: true
    }
  ]
})
export class PrySelectComponent extends SubscriptionnerDirective implements ControlValueAccessor {
  public id: number = uniqueId++;
  _items$ = new BehaviorSubject<any[]>([]);
  matchingItems$: Observable<any>;
  open = false;
  activeDescendant: number = -1;
  valueItems$: Observable<any>;
  value$ = new BehaviorSubject<any>(undefined);
  searchSelected$ = new BehaviorSubject<boolean>(false);

  @Input() set items(items: any[] | null | undefined) {
    this._items$.next(items ?? []);
  }

  @Input() clearable = false;
  @Input() multiple = false;
  @Input() closeOnSelect = true;
  @Input() placeholder?: string;
  @Input() isForm = false;
  @Input() required?: any;
  @Input() name?: any;
  @Input() readonly = false;
  @Input() autocomplete: boolean = false;
  @Input() bindValue: string | undefined;
  @Input() bindLabel: string | undefined;
  @Input() iconSize = [14, 14];
  @Input() bindIcon: any;
  @Input() template?: TemplateRef<any>;
  @Input() i18nPrefix: string | null = null;
  @Output() searched = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();
  search$ = new BehaviorSubject<string>('');

  _loading = false;
  hasLoaded: boolean = false;
  @Input() set loading(loading: boolean) {
    this._loading = loading;
    if (this._loading) {
      this.hasLoaded = true;
    }
  }
  get loading() {
    return this._loading;
  }

  get disabled(): boolean {
    return this._disabled;
  }

  overlayRef?: OverlayRef;
  @ViewChild('optionsModal', { read: TemplateRef }) optionsModal!: TemplateRef<any>;
  @ViewChild('selectElement') public selectElement!: ElementRef<HTMLDivElement>;
  @Input() elementRef!: HTMLDivElement;

  private _onChange = (_: any) => {};
  private _onTouched = () => {};
  private _disabled = false;
  focused = false;
  modalWidth = 200;

  get modalId() {
    return 'select-modal-' + this.id;
  }

  constructor(private _cd: ChangeDetectorRef, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super();
    this.matchingItems$ = combineLatest([this._items$, this.search$, this.searchSelected$]).pipe(
      map(([items, term, alreadySelected]) =>
        this.autocomplete && term && term.length > 0 && !alreadySelected
          ? items.filter((i) => {
              const itemValue = this.bindLabel ? i?.[this.bindLabel] : i;
              return itemValue.indexOf(term) > -1;
            })
          : items
      )
    );
    this.valueItems$ = combineLatest([this.value$, this._items$]).pipe(
      map(([value, items]) =>
        (this.multiple ? value ?? [] : !!value ? [value] : []).map((value: any) => {
          const keyProp = this.bindValue ?? this.bindLabel ?? 'id';
          return items.find((item) => {
            return typeof item === 'object'
              ? typeof value === 'object'
                ? item[keyProp] === value[keyProp]
                : item[keyProp] === value
              : item === value;
          });
        })
      )
    );
    this.subscriptions.add(
      this.valueItems$.subscribe((item) => {
        if (!this.multiple) {
          const itemValue = this.bindLabel ? item[0]?.[this.bindLabel] : item[0];
          if (itemValue) {
            this.search$.next(itemValue);
            this.searchSelected$.next(true);
          }
        }
      })
    );
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this._cd.markForCheck();
  }

  writeValue(obj: any): void {
    if (!equal(this.value$.getValue(), obj)) {
      this.value$.next(obj);
      this._onChange(this.value$.getValue());
      this._onTouched();
      this._cd.markForCheck();
      this.search$.next(obj);
      this.searchSelected$.next(true);
    }
  }

  clear($event: Event, item: any) {
    $event.stopPropagation();
    const itemValue = this.bindValue ? item?.[this.bindValue] : item;
    const keyProp = this.bindValue ?? this.bindLabel ?? 'id';
    this.writeValue(
      this.value$
        .getValue()
        .filter((i: any) => (typeof itemValue === 'object' ? i[keyProp] !== itemValue[keyProp] : i !== itemValue))
    );
  }

  clearAll($event: Event) {
    $event.stopPropagation();
    if (this.multiple) {
      this.writeValue([]);
    } else {
      this.writeValue(undefined);
    }
    this.search('');
    this.cleared.next();
  }

  search($event: string) {
    this.search$.next($event);
    this.searched.next($event);
    this.searchSelected$.next(false);
  }

  select($event: Event, item: any, index: number) {
    const itemValue = this.bindValue ? item?.[this.bindValue] : item;
    const keyProp = this.bindValue ?? this.bindLabel ?? 'id';
    if (this.multiple) {
      if (!this.value$.getValue()) {
        this.writeValue([itemValue]);
      } else {
        if (
          typeof itemValue === 'object'
            ? this.value$
                .getValue()
                .map((val: any) => val[keyProp])
                .includes(itemValue[keyProp])
            : this.value$.getValue().includes(itemValue)
        ) {
          this.clear($event, item);
        } else {
          this.writeValue([...this.value$.getValue(), itemValue]);
        }
      }
    } else {
      this.writeValue(itemValue);
    }
    if (this.closeOnSelect) {
      this.toggle(false);
    }
    this.activeDescendant = index;
    const itemLabel = this.bindLabel ? item?.[this.bindLabel] : item;
    this.search$.next(itemLabel);
    this.searchSelected$.next(true);
  }

  toggle(force?: boolean) {
    if (!this.disabled) {
      if (this.open !== force) {
        this.open = force !== undefined ? force : !this.open;
        if (this.open) {
          this.modalWidth = this._elementRef.getBoundingClientRect().width - 5;
          this.overlayRef = this.overlay.create(this.getOverlayConfig());
          this.overlayRef.backdropClick().subscribe(() => {
            this.toggle(false);
            if (this.autocomplete) {
              this.writeValue(this.search$.getValue());
            }
          });
          this.overlayRef.attach(new TemplatePortal(this.optionsModal, this.viewContainerRef));
        } else {
          this.overlayRef?.dispose();
          this.overlayRef = undefined;
        }
      }
    }
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        }
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      panelClass: ['a-pry-select__options'],
      backdropClass: 'a-pry-select__backdrop'
    });
  }

  get _elementRef(): HTMLDivElement {
    return this.elementRef ?? this.selectElement.nativeElement;
  }
}
