import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent, SubscriptionnerDirective } from '@provoly/dashboard';
import { combineLatest, debounceTime, startWith, Subject } from 'rxjs';
import { distinctUntilChanged, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'pry-date-filter',
  templateUrl: './date-filter.component.html'
})
export class DateFilterComponent extends BaseFilterComponent implements SubscriptionnerDirective, OnInit {
  value$ = new Subject<string>();
  date1?: string;
  date2?: string;
  date1$ = new Subject<string>();
  date2$ = new Subject<string>();

  constructor(store: Store) {
    super(store);
    this.type = 'date';
  }

  ngOnInit() {
    if (this.filter?.hasDateRange) {
      this.date1 = (this.filter?.value ?? '').split(',')[0];
      this.date2 = (this.filter?.value ?? '').split(',')[0];
      this.subscriptions.add(
        combineLatest([
          this.date1$.pipe(debounceTime(1800), startWith(this.date1)),
          this.date2$.pipe(debounceTime(1800), startWith(this.date2))
        ])
          .pipe(skipWhile(([date1, date2]) => date1 === this.date1 && date2 === this.date2))
          .subscribe(([date1, date2]) => {
            if (date1 && date2) {
              this.setFilter(date1 + ',' + date2);
            } else {
              this.setFilter('');
            }
          })
      );
    } else {
      this.subscriptions.add(
        this.value$.pipe(distinctUntilChanged(), debounceTime(1000)).subscribe((value) => this.setFilter(value))
      );
    }
  }

  setFilter(value: string) {
    super.updateFilter(value);
  }
}
