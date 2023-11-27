import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent, SearchService } from '@provoly/dashboard';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import equal from 'fast-deep-equal/es6';

@Component({
  selector: 'pry-autocomplete',
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent extends BaseFilterComponent implements OnInit, OnDestroy {
  search$ = new BehaviorSubject<string>('');
  autocomplete$?: Observable<string[]>;

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
      switchMap((search) => this.searchService.autocomplete(this.filter?.attributes, search))
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
}
