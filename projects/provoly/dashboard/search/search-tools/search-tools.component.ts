import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ClassActions,
  ClassState,
  DashboardActions,
  DataSourceActions,
  DataSourceSelectors,
  DataSourceState,
  DEFAULT_NAMED_QUERY_ID,
  FieldActions,
  FieldState,
  NamedQuery,
  NamedQueryTypes
} from '@provoly/dashboard';
import { combineLatest, map, Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 } from 'uuid';
import { SearchFulltextChange } from '../search-fulltext/search-fulltext/search-fulltext.component';
import { SearchMonoClassActions } from '../search-mono-class/store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../search-mono-class/store/search-mono-class.selectors';
import { SearchMultiClassActions } from '../search-multi-class/store/search-multi-class.actions';
import { SearchMultiClassState } from '../search-multi-class/store/search-multi-class.reducer';
import { SearchMultiClassSelectors } from '../search-multi-class/store/search-multi-class.selectors';

@Component({
  selector: 'pry-search-tools',
  templateUrl: './search-tools.component.html'
})
export class PrySearchToolsComponent implements OnDestroy {
  @HostBinding('class.o-pry-search-tools-wrapper') class = true;
  @HostBinding('class.is-close') searchToolsClose = false;

  searchMultiClassValid$: Observable<boolean>;
  searchMonoClassValid$: Observable<boolean>;
  loading$: Observable<boolean>;
  isRename$: Observable<boolean>;

  isSearchCriteria = false;
  isSearchMono = false;
  isSearchFullText = false;
  isSearchFulltextValid = false;
  isMoreList = false;
  widgetType: string = 'table';

  get isNewMono(): boolean {
    return this.isSearchCriteria && this.isSearchMono;
  }

  get isEditMono$(): Observable<boolean> {
    return combineLatest([this.currentEditType$, this.isRename$]).pipe(
      map(([type, isRename]) => type === NamedQueryTypes.MONO_CLASS && !isRename)
    );
  }

  getIcon = {
    caracteristique: 'default',
    lieu: 'default',
    meteo: 'default',
    usager: 'profil',
    valeur_fonciere: 'default',
    vehicule: 'car'
  } as { [clazz: string]: string };

  items: Observable<any[] | null> = of([
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
    { id: 4, name: '4' }
  ]);
  editInProgress$: Observable<boolean>;
  currentEdit$: Observable<NamedQuery | undefined>;
  currentEditType$: Observable<NamedQueryTypes | undefined>;
  readonly FULL_TEXT = NamedQueryTypes.FULL_TEXT;
  readonly MONO_CLASS = NamedQueryTypes.MONO_CLASS;
  readonly MULTI_CLASS = NamedQueryTypes.MULTI_CLASS;
  searchFulltextTemp?: SearchFulltextChange;

  private sub = new Subscription();

  constructor(private store: Store<DataSourceState | SearchMultiClassState | FieldState | ClassState>) {
    this.loading$ = this.store.select(DataSourceSelectors.isLoading);
    this.store.dispatch(DataSourceActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(ClassActions.load());
    this.searchMultiClassValid$ = this.store.select(SearchMultiClassSelectors.searchMultiClassValid).pipe(delay(100));
    this.searchMonoClassValid$ = this.store.select(SearchMonoClassSelectors.searchMonoClassValid).pipe(delay(100));
    this.editInProgress$ = this.store.select(DataSourceSelectors.editInProgress);
    this.currentEditType$ = this.store.select(DataSourceSelectors.currentEditType);
    this.currentEdit$ = this.store.select(DataSourceSelectors.currentEdit);
    this.isRename$ = this.store.select(DataSourceSelectors.isRename);
    this.sub.add(
      combineLatest([this.editInProgress$, this.isRename$]).subscribe(([editInProgress, isRename]) => {
        if (editInProgress && this.searchToolsClose && !isRename) {
          this.onChangePanel();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSearchCriteria() {
    this.isSearchCriteria = true;
    this.store.dispatch(
      DataSourceActions.namedQuery.openEdit({
        currentEdit: {
          sourceType: 'namedQuery',
          id: v4(),
          request: { type: NamedQueryTypes.MULTI_CLASS, fullSearch: null, fields: [], multiType: 'AND' },
          name: ''
        }
      })
    );
  }

  onSearchTools() {
    this.isSearchCriteria = false;
    this.store.dispatch(DataSourceActions.namedQuery.stopEdit());
    this.resizeScreen();
  }

  back() {
    this.store.dispatch(DataSourceActions.namedQuery.stopEdit());
    this.resizeScreen();
  }

  onMonoSearch() {
    this.isSearchMono = !this.isSearchMono;
    this.resizeScreen();
  }

  onChangeListView(isMoreList: boolean) {
    this.isMoreList = !isMoreList;
  }

  onSearchFulltextChange(payload: SearchFulltextChange) {
    setTimeout(() => {
      this.isSearchFulltextValid = payload.value !== '';
      this.searchFulltextTemp = payload;
    }, 10);
  }

  onSearch() {
    if (this.isSearchMono) {
      this.store.dispatch(SearchMonoClassActions.search());
    } else {
      this.store.dispatch(SearchMultiClassActions.search());
    }
    this.store.dispatch(
      DashboardActions.updateWidgetInPresentation({
        id: DEFAULT_NAMED_QUERY_ID,
        widgetType: this.widgetType
      })
    );
  }

  onChangePanel() {
    this.searchToolsClose = !this.searchToolsClose;
    this.resizeScreen();
  }

  private resizeScreen() {
    setTimeout(() => window?.dispatchEvent(new Event('resize')), 400);
  }

  selectWidget($event: string) {
    this.widgetType = $event;
  }

  reset() {
    this.store.dispatch(DataSourceActions.namedQuery.stopEdit());
    this.isSearchCriteria = true;
  }

  updateVisibility($event: any) {
    this.store.dispatch(DataSourceActions.namedQuery.updateCurrentEdit({ currentEdit: { visibility: $event } }));
  }
}
