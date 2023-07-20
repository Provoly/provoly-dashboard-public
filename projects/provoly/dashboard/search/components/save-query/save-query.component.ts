import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  DataSourceActions,
  DataSourceSelectors,
  DEFAULT_NAMED_QUERY_ID,
  EXPLORE_NAMED_QUERY_ID,
  NamedQuery,
  NamedQueryTypes,
  PRY_DIALOG_DATA,
  PryDialogRef,
  PryVisibility,
  PryVisibilityType
} from '@provoly/dashboard';
import { Observable, take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { SearchFulltextChange } from '../../search-fulltext/search-fulltext/search-fulltext.component';
import { searchFulltextActions } from '../../search-fulltext/store/search-fulltext.actions';
import { SearchMonoClassActions } from '../../search-mono-class/store/search-mono-class.actions';
import { SearchMultiClassActions } from '../../search-multi-class/store/search-multi-class.actions';

@Component({
  selector: 'pry-save-query',
  templateUrl: './save-query.component.html'
})
export class PrySaveQueryComponent implements OnInit {
  value: string = '';
  opened = false;
  currentEdit$: Observable<NamedQuery | undefined>;
  isEdit = false;

  id?: string;
  name: string = '';
  description: string = '';
  visibility: PryVisibility = {
    type: PryVisibilityType.PRIVATE,
    users: []
  };
  savedNameQuery?: NamedQuery;

  get modalSave(): boolean {
    return this.data.save;
  }

  get saveDisabled(): boolean {
    return (
      (this.name ?? '') === '' ||
      (this.savedNameQuery?.name === this.name && !this.savedNameQuery?.owner) ||
      this.name.length > 30 ||
      this.description.length > 200
    );
  }

  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('save') save!: ElementRef<HTMLButtonElement>;

  constructor(
    private store: Store,
    private dialog: PryDialogRef<PrySaveQueryComponent>,
    @Inject(PRY_DIALOG_DATA)
    private data: {
      save: boolean;
      type: NamedQueryTypes;
      payload?: SearchFulltextChange;
    }
  ) {
    this.currentEdit$ = this.store.select(DataSourceSelectors.currentEdit);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cross.nativeElement.focus();
    }, 10);

    this.currentEdit$.pipe(take(1)).subscribe((nq) => {
      if (nq) {
        this.savedNameQuery = nq;
        this.id = nq.id;
        this.isEdit = true;
        this.name = nq.name;
        this.description = nq.description ?? '';
      }
    });
  }

  onSave() {
    const id =
      this.id === DEFAULT_NAMED_QUERY_ID || this.id === EXPLORE_NAMED_QUERY_ID || !this.id ? uuidv4() : this.id;
    if (this.name !== '') {
      const descriptionQuery = {
        name: this.name,
        description: this.description ?? undefined,
        visibility: this.visibility
      };
      switch (this.data.type) {
        case NamedQueryTypes.FULL_TEXT:
          const classes = this.data.payload?.classes ?? [];
          const search = this.data.payload?.value ?? '';
          this.store.dispatch(searchFulltextActions.save({ descriptionQuery, classes, search, id }));
          break;
        case NamedQueryTypes.MONO_CLASS:
          this.store.dispatch(SearchMonoClassActions.save({ descriptionQuery, id }));
          break;
        case NamedQueryTypes.MULTI_CLASS:
          this.store.dispatch(SearchMultiClassActions.save({ descriptionQuery, id }));
          break;
      }
      this.onClose();
    }
  }

  focusCrossElement() {
    this.cross.nativeElement.focus();
  }

  focusValidation() {
    this.save.nativeElement.focus();
  }

  onClose() {
    this.store.dispatch(ConfigActions.closeOverlay({ id: 'PrySaveQueryComponent' }));
    this.store.dispatch(DataSourceActions.namedQuery.stopRename());
    if (this.isEdit) {
      this.store.dispatch(DataSourceActions.namedQuery.stopEdit());
    }
    this.isEdit = false;
    this.dialog.close();
  }
}
