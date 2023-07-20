import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassSelectors,
  ClassState,
  DashboardActions,
  DEFAULT_NAMED_QUERY_ID,
  FullTextSearchPayload,
  NamedQuery
} from '@provoly/dashboard';
import { Observable, take } from 'rxjs';
import { searchFulltextActions } from '../store/search-fulltext.actions';

export interface SearchFulltextChange {
  classes: string[];
  value: string;
}

@Component({
  selector: 'pry-search-fulltext',
  templateUrl: './search-fulltext.component.html'
})
export class PrySearchFulltextComponent implements OnInit {
  @ViewChild('searchButton', { read: ElementRef }) searchButton?: ElementRef;
  @ViewChild('searchTrigger', { read: ElementRef }) searchTrigger!: ElementRef;
  @ViewChild('searchInput', { read: ElementRef }) searchInputRef!: ElementRef;
  @ViewChild('searchOverlay', { read: ElementRef }) searchOverlayRef!: ElementRef;
  @ViewChild('searchClass') searchClass!: ElementRef<HTMLButtonElement>;
  @ViewChild('chooseClasses') chooseClasses!: ElementRef;
  selectedClassItem?: Element | null;
  panelClassesOpen = false;
  panelSearchOpen = false;
  searchPanelWidth?: number;

  @Input() mode: 'inline' | 'vertical' = 'inline';
  @Input() launchButton: boolean = true;

  @Input() set currentEdit(nq: NamedQuery | null | undefined) {
    if (nq) {
      const request = nq.request as FullTextSearchPayload;
      this.search = request.fullSearch?.value;
      this.classesSelected = request.oClasses ?? [];
    } else {
      this.search = '';
      this.classesSelected = [];
    }
    this.searchDisabled = this.search === '';
    this.emitChange(this.search, this.classesSelected);
  }

  search = '';
  isFocused = false;
  @Output() searchChange = new EventEmitter<SearchFulltextChange>();

  private readonly BOTTOM_POSITION: ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  };
  private readonly TOP_POSITION: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom'
  };
  positions: ConnectedPosition[] = [this.BOTTOM_POSITION, this.TOP_POSITION];

  widgetSelected?: string;

  classesSelected: string[] = [];

  classes$: Observable<Class[]>;
  classesSelectedLabel = '@pry.search.fulltext.allClasses';
  searchDisabled = true;
  panelBottom: any;

  constructor(private store: Store<ClassState>) {
    this.classes$ = this.store.select(ClassSelectors.classes);
  }

  ngOnInit(): void {
    this.emitChange(this.search, this.classesSelected);
  }

  onArrowUp() {
    const lastElement = this.chooseClasses.nativeElement.lastElementChild;
    if (this.selectedClassItem?.previousElementSibling) {
      this.selectedClassItem = this.selectedClassItem?.previousElementSibling;
    } else {
      this.selectedClassItem = lastElement;
    }
    const focusElement = this.selectedClassItem as HTMLButtonElement;
    focusElement.focus();
  }

  onArrowDown() {
    const firstElement = this.chooseClasses.nativeElement.firstElementChild;
    if (this.selectedClassItem?.nextElementSibling) {
      this.selectedClassItem = this.selectedClassItem?.nextElementSibling;
    } else {
      this.selectedClassItem = firstElement;
    }
    const focusElement = this.selectedClassItem as HTMLButtonElement;
    focusElement.focus();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.panelSearchOpen) {
      setTimeout(() => {
        this.selectedClassItem = this.chooseClasses?.nativeElement?.firstElementChild;
      }, 10);
      const clickInput = this.searchInputRef?.nativeElement?.contains(event.target);
      if (!clickInput) {
        const clickPanel = this.searchOverlayRef?.nativeElement?.contains(event.target);
        if (!clickPanel) {
          this.panelSearchOpen = false;
        }
      }
    }
  }

  @HostListener('window:keyup.enter', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.chooseClasses?.nativeElement?.firstElementChild.focus();
    this.selectedClassItem = this.chooseClasses?.nativeElement?.firstElementChild;
    const search = this.search;
    if ((search ?? '') !== '' && (this.panelSearchOpen || this.isFocused)) {
      this.searchButton?.nativeElement.click();
    }
  }

  closeFocus() {
    if (this.panelClassesOpen) {
      this.panelClassesOpen = false;
      this.searchClass?.nativeElement?.focus();
    }
  }

  onSearch() {
    this.panelSearchOpen = false;
    const search = this.search;
    if ((search ?? '') !== '') {
      const classes = this.classesSelected;
      this.store.dispatch(searchFulltextActions.search({ classes, search }));
      this.store.dispatch(
        DashboardActions.updateWidgetInPresentation({
          id: DEFAULT_NAMED_QUERY_ID,
          widgetType: this.widgetSelected ?? 'table'
        })
      );
    }
  }

  onChangeSearch(evt: any) {
    const value = evt?.target?.value ?? '';
    this.searchDisabled = value === '';
    this.emitChange(value, this.classesSelected);
  }

  onClearSearch(evt: any) {
    this.search = '';
    this.searchDisabled = true;
    this.emitChange(this.search, this.classesSelected);
  }

  onOpenSearchPanel() {
    this.isFocused = true;
    this.searchPanelWidth = this.searchInputRef.nativeElement.getBoundingClientRect().width;
    this.panelSearchOpen = true;
  }

  onFocusOut() {
    this.isFocused = false;
  }

  onSelectWidget(widget: string) {
    this.widgetSelected = this.widgetSelected === widget ? undefined : widget;
  }

  onSelectAllClasses() {
    this.classesSelected = [];
    this.classesSelectedLabel = '@pry.search.fulltext.allClasses';
  }

  onSelectClass(clazz: Class) {
    if (this.classesSelected.indexOf(clazz.id) !== -1) {
      this.classesSelected = this.classesSelected.filter((c) => clazz.id !== c);
    } else {
      this.classesSelected = [...this.classesSelected, clazz.id];
    }

    this.emitChange(this.search, this.classesSelected);

    if (this.classesSelected?.length === 1) {
      this.classes$.pipe(take(1)).subscribe((classes) => {
        this.classesSelectedLabel =
          classes.find((c) => this.classesSelected[0] === c.id)?.name ?? '@pry.search.fulltext.oneClass';
      });
    } else if (this.classesSelected?.length > 1) {
      this.classesSelectedLabel = '@pry.search.fulltext.manyClasses';
    } else {
      this.classesSelectedLabel = '@pry.search.fulltext.allClasses';
    }
  }

  private emitChange(value: string, classes: string[]) {
    const payload = { value, classes };
    this.searchChange.emit(payload);
  }
}
