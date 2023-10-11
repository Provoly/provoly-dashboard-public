import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DataSourceActions,
  DataSourceSelectors,
  DatasourceUtils,
  DEFAULT_NAMED_QUERY_ID,
  NamedQuery,
  NamedQueryTypes,
  SearchActions,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { SearchFulltextChange } from '../../search-fulltext/search-fulltext/search-fulltext.component';
import { searchFulltextActions } from '../../search-fulltext/store/search-fulltext.actions';
import { SearchMonoClassActions } from '../../search-mono-class/store/search-mono-class.actions';
import { SearchMonoClassSelectors } from '../../search-mono-class/store/search-mono-class.selectors';
import { SearchMultiClassActions } from '../../search-multi-class/store/search-multi-class.actions';
import { SearchMultiClassSelectors } from '../../search-multi-class/store/search-multi-class.selectors';

@Component({
  selector: 'pry-edit-named-query',
  templateUrl: './edit-named-query.component.html'
})
export class EditNamedQueryComponent extends SubscriptionnerDirective {
  @HostBinding('class') class = 'o-edit-named-query-wrapper';
  currentEditType$: Observable<NamedQueryTypes | undefined>;
  currentEdit$: Observable<NamedQuery | undefined>;
  searchMultiClassValid$: Observable<boolean>;
  searchMonoClassValid$: Observable<boolean>;
  readonly FULL_TEXT = NamedQueryTypes.FULL_TEXT;
  readonly MONO_CLASS = NamedQueryTypes.MONO_CLASS;
  readonly MULTI_CLASS = NamedQueryTypes.MULTI_CLASS;
  isSearchCriteria = false;
  isSearchParams = false;
  @Input() fromWidget?: { windowsIndex: number; widgetIndex: number };
  DEFAULT_NAMED_QUERY_ID = DEFAULT_NAMED_QUERY_ID;

  @Output() searchFulltextChange = new EventEmitter<SearchFulltextChange>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() searched = new EventEmitter<void>();
  currentEdit?: NamedQuery;
  private fullTextPayload: SearchFulltextChange = { value: '', classes: [] };
  widgetType: string = 'table';

  constructor(private store: Store) {
    super();
    this.currentEditType$ = this.store.select(DataSourceSelectors.currentEditType);
    this.currentEdit$ = this.store.select(DataSourceSelectors.currentEdit);
    this.searchMultiClassValid$ = this.store.select(SearchMultiClassSelectors.searchMultiClassValid);
    this.searchMonoClassValid$ = this.store.select(SearchMonoClassSelectors.searchMonoClassValid);
    this.subscriptions.add(this.currentEdit$.subscribe((currentEdit) => (this.currentEdit = currentEdit)));
  }

  cancel() {
    this.isSearchCriteria = false;
    this.isSearchParams = false;
    this.store.dispatch(DataSourceActions.namedQuery.stopEdit());
    this.cancelled.emit();
  }

  search() {
    // Save as current name
    const descriptionQuery = {
      name: this.currentEdit?.name ?? '',
      description: this.currentEdit?.description,
      visibility: this.currentEdit?.visibility ?? undefined
    };
    switch (DatasourceUtils.getTypeFromPayload(this.currentEdit?.request)) {
      case NamedQueryTypes.FULL_TEXT:
        this.store.dispatch(
          searchFulltextActions.save({
            descriptionQuery,
            id: this.currentEdit?.id,
            classes: this.fullTextPayload.classes,
            search: this.fullTextPayload.value
          })
        );
        break;
      case NamedQueryTypes.MONO_CLASS:
        this.store.dispatch(SearchMonoClassActions.save({ descriptionQuery, id: this.currentEdit?.id }));
        break;
      case NamedQueryTypes.MULTI_CLASS:
        this.store.dispatch(SearchMultiClassActions.save({ descriptionQuery, id: this.currentEdit?.id }));
        break;
    }
    if (this.currentEdit?.id !== DEFAULT_NAMED_QUERY_ID) {
      this.store.dispatch(SearchActions.getDatasourceItems({ id: this.currentEdit?.id ?? DEFAULT_NAMED_QUERY_ID }));
    }
    this.store.dispatch(
      DashboardActions.updateWidgetInPresentation({
        id: this.currentEdit?.id ?? DEFAULT_NAMED_QUERY_ID,
        widgetType: this.widgetType
      })
    );
    this.searched.emit();
  }

  onSearchFulltextChange(evt: SearchFulltextChange) {
    this.searchFulltextChange.emit(evt);
    this.fullTextPayload = evt;
  }

  select($event: string) {
    this.widgetType = $event;
  }
}
