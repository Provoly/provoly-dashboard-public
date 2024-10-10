import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent, SubscriptionnerDirective } from '@provoly/dashboard';

@Component({
  selector: 'pry-date-filter',
  templateUrl: './date-filter.component.html'
})
export class DateFilterComponent extends BaseFilterComponent implements SubscriptionnerDirective, OnInit {
  dates: string[] = ['', ''];

  constructor(store: Store) {
    super(store);
    this.type = 'date';
  }

  override ngOnInit() {
    super.ngOnInit();
    if (this.filter?.hasDateRange) {
      if (this.filter?.value) {
        this.dates = this.filter?.value.toString().split(',');
      }
    } else {
      this.dates[0] = (this.filter?.value ?? '').toString();
    }
  }

  onDateChange(index: number, value: string) {
    this.dates[index] = value;
    if (this.filter?.hasDateRange) {
      if (this.dates.filter((date) => !!date).length === this.dates.length) {
        super.updateFilter(this.dates.join(','));
      } else if (this.dates.filter((date) => !!date).length === 0) {
        super.updateFilter('');
      }
    } else {
      super.updateFilter(value ?? '');
    }
  }

  clearDate(index: number) {
    this.onDateChange(index, '');
    this.cleared.next();
  }
}
