import { ConnectedPosition } from '@angular/cdk/overlay';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  InjectionToken,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';

export type PryCardStatus = 'selected' | 'unselected';

const OVERLAY_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top'
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom'
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom'
  }
];

const PRY_CARD_ICON = new InjectionToken<PryCardIconDirective>('pry-card-icon');

@Directive({
  selector: `pry-card-icon, [pry-card-icon], [pryCardIcon]`,
  providers: [{ provide: PRY_CARD_ICON, useExisting: PryCardIconDirective }]
})
export class PryCardIconDirective {
  @HostBinding('class') class = 'o-pry-card-icon';
}

/**
 * Title of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: `pry-card-title, [o-pry-card-title], [pryCardTitle]`
})
export class PryCardTitleDirective {
  @HostBinding('class') class = 'o-pry-card-title';
}

/**
 * Subtitle of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: `pry-card-subtitle, [pry-card-subtitle], [pryCardSubtitle]`
})
export class PryCardSubtitleDirective {
  @HostBinding('class') class = 'pry-card-subtitle';
}

const PRY_CARD_MENU = new InjectionToken<PryCardMenuDirective>('pry-card-menu');

@Directive({
  selector: 'pry-card-menu',
  exportAs: 'pryCardMenu',
  providers: [{ provide: PRY_CARD_MENU, useExisting: PryCardMenuDirective }]
})
export class PryCardMenuDirective {
  @HostBinding('class') class = 'o-pry-card-menu';
  @Output() readonly closeMenu$ = new EventEmitter<boolean>();

  closeMenu(): void {
    this.closeMenu$.emit(true);
  }
}

@Component({
  selector: 'pry-card',
  templateUrl: 'card.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryCardComponent {
  @HostBinding('class') class = 'pry-card';

  @HostListener('click') _selectCard() {
    this.selected = !this.selected;
    this._status = this.selected ? 'selected' : 'unselected';
    this.statusChange.emit(this._status);
  }

  @Output() statusChange = new EventEmitter<PryCardStatus>();

  @HostBinding('class.pry-card-selected')
  @Input()
  get selected(): boolean {
    return this._selected;
  }

  set selected(value: boolean) {
    if (value !== this._selected) {
      this._selected = value;
      this._status = value ? 'selected' : 'unselected';
    }
  }

  protected _selected: boolean = false;
  protected _status: PryCardStatus = 'unselected';
}

@Component({
  selector: 'pry-card-header',
  templateUrl: 'card-header.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PryCardHeaderComponent implements AfterContentInit, OnDestroy {
  @ViewChild('trigger') trigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('menuList') menuList!: ElementRef;
  selectedItem?: Element | null;
  @HostBinding('class') class = 'o-pry-card-header-wrapper';
  @ContentChildren(PRY_CARD_MENU, { descendants: true }) _menuChildren!: QueryList<PryCardMenuDirective>;
  @ContentChildren(PRY_CARD_ICON, { descendants: true }) _iconChildren!: QueryList<PryCardIconDirective>;
  readonly overlayPositions = OVERLAY_POSITIONS;

  @Input() marker = true;

  get menuOpen(): boolean {
    return this._menuOpen;
  }

  focusChild() {
    setTimeout(() => {
      this.menuList?.nativeElement?.children[0].children[0].firstElementChild.focus();
      this.selectedItem = this.menuList?.nativeElement?.children[0].children[0].firstElementChild;
    }, 10);
  }

  set menuOpen(value: boolean) {
    this._menuOpen = value;
  }

  protected _menuOpen: boolean = false;

  private menuSub?: Subscription;
  private childrensSub: Subscription = new Subscription();

  constructor(private _detect: ChangeDetectorRef) {}

  onArrowUp() {
    const lastElement = this.menuList?.nativeElement?.children[0].children[0].lastElementChild;
    if (this.selectedItem?.previousElementSibling) {
      this.selectedItem = this.selectedItem?.previousElementSibling;
    } else {
      this.selectedItem = lastElement;
    }
    const focusElement = this.selectedItem as HTMLButtonElement;
    const focusChildrenElement = this.selectedItem?.children[0] as HTMLButtonElement;
    const focusSecondChildElement = this.selectedItem?.children[0].children[0] as HTMLButtonElement;
    if (focusChildrenElement) {
      focusChildrenElement.focus();
    }
    if (focusSecondChildElement) {
      focusSecondChildElement.focus();
    }
    focusElement.focus();
  }

  onArrowDown() {
    const firstElement = this.menuList?.nativeElement?.children[0].children[0].firstElementChild;
    if (this.selectedItem?.nextElementSibling) {
      this.selectedItem = this.selectedItem?.nextElementSibling;
    } else {
      this.selectedItem = firstElement;
    }
    const focusElement = this.selectedItem as HTMLButtonElement;
    const focusChildrenElement = this.selectedItem?.children[0] as HTMLButtonElement;
    const focusSecondChildElement = this.selectedItem?.children[0].children[0] as HTMLButtonElement;
    if (focusChildrenElement) {
      focusChildrenElement.focus();
    }
    if (focusSecondChildElement) {
      focusSecondChildElement.focus();
    }
    focusElement.focus();
  }

  closeToEscape() {
    this.menuOpen = false;
    this.trigger.nativeElement.focus();
  }

  ngAfterContentInit(): void {
    // after init it subscribes closeMenu$ if there's a menu
    const firstMenu = this._menuChildren.get(0);
    this.manageMenuCloseSubscription(firstMenu);
    // after each change of template it subscribes at the new first menu
    this.childrensSub.add(
      this._menuChildren.changes.subscribe((menus: QueryList<PryCardMenuDirective>) => {
        const menu = menus.get(0);
        this.manageMenuCloseSubscription(menu);
        this._detect.detectChanges();
      })
    );
    this.childrensSub.add(
      this._iconChildren.changes.subscribe(() => {
        this._detect.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.menuSub?.unsubscribe();
    this.childrensSub.unsubscribe();
  }

  private manageMenuCloseSubscription(menu: PryCardMenuDirective | undefined): void {
    if (!menu) {
      this.menuSub?.unsubscribe();
      return;
    }
    this.menuSub = menu.closeMenu$.subscribe(() => {
      this.menuOpen = false;
      this._detect.detectChanges();
    });
  }
}
