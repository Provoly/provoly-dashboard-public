import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent, SearchActions, SearchSelectors, SearchService } from '@provoly/dashboard';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  skipUntil,
  startWith,
  Subject,
  switchMap
} from 'rxjs';
import equal from 'fast-deep-equal/es6';
import { tap } from 'rxjs/operators';
import { Attribute } from '@provoly/dashboard/toolbox';

@Component({
  selector: 'pry-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent extends BaseFilterComponent implements OnInit, OnDestroy {
  search$ = new BehaviorSubject<string>('');
  autocomplete$?: Observable<string[]>;
  loader: boolean = false;
  preventInitCall$ = new Subject<void>();
  possibleFilterValues$!: Observable<string[]>;
  possibleFilterValues: string[] = [];
  items$ = new Subject<string[]>();
  selectClicked = new EventEmitter<void>();

  constructor(
    store: Store,
    private searchService: SearchService
  ) {
    super(store);
    this.type = 'autocomplete';
  }

  override ngOnInit() {
    this.possibleFilterValues$ = this.store.select(SearchSelectors.possibleFilterValues(this.filter?.id));
    this.subscriptions.add(this.possibleFilterValues$.subscribe((values) => (this.possibleFilterValues = values)));

    super.ngOnInit();
    if (this.filter?.attributes) {
      this.store.dispatch(
        SearchActions.getPossibleFilterValues({
          filterId: this.filter?.id ?? '',
          attributes: this.filter?.attributes as Omit<Attribute, 'customId'>[]
        })
      );
    }

    this.search$.next(`${this._value}`);
    this.autocomplete$ = this.search$.pipe(
      distinctUntilChanged((p, v) => equal(p, v)),
      skipUntil(this.preventInitCall$),
      debounceTime(500),
      switchMap((search) => {
        if (!!search && search.length > 1) {
          this.loader = true;
          this.items$.next([]);
          return this.searchService.autocomplete(this.filter?.attributes, search, this.filter?.limit).pipe(
            tap(() => (this.loader = false)),
            catchError((err) => {
              this.loader = false;
              console.error('Autocomplete failed', err);
              return [];
            })
          );
        }
        return of([] as string[]);
      })
    );
    setTimeout(() => this.preventInitCall$.next(), 200);

    this.subscriptions.add(
      combineLatest([this.possibleFilterValues$, this.autocomplete$.pipe(startWith([] as string[]))])
        .pipe(map(([possibleValues, autocomplete]) => (autocomplete.length > 0 ? autocomplete : possibleValues)))
        .subscribe((values) => this.items$.next(values))
    );

    this.selectClicked.subscribe((_) => this.items$.next(this.possibleFilterValues));
  }

  setFilter(value: string) {
    if (value !== this.filter?.value) {
      super.updateFilter(value);
    }
  }

  updateSearch($event?: Event) {
    // @ts-ignore
    const value = $event ? $event.target!.value : '';
    this.search$.next(value);
  }

  clear() {
    this.search$.next('');
  }
}
