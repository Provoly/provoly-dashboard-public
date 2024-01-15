import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent, SearchService } from '@provoly/dashboard';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import equal from 'fast-deep-equal/es6';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'pry-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent extends BaseFilterComponent implements OnInit, OnDestroy {
  search$ = new BehaviorSubject<string>('');
  autocomplete$?: Observable<string[]>;
  loader: boolean = false;

  constructor(store: Store, private searchService: SearchService) {
    super(store);
    this.type = 'autocomplete';
  }

  override ngOnInit() {
    super.ngOnInit();
    this.search$.next(this._value);
    this.autocomplete$ = this.search$.pipe(
      distinctUntilChanged((p, v) => equal(p, v)),
      debounceTime(500),
      switchMap((search) => {
        if (!!search && search.length > 1) {
          this.loader = true;
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
