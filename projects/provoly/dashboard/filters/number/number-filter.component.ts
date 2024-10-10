import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent } from '@provoly/dashboard';
import { debounceTime, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'pry-number-filter',
  templateUrl: './number-filter.component.html'
})
export class NumberFilterComponent extends BaseFilterComponent {
  value$ = new Subject<string>();

  constructor(store: Store) {
    super(store);
    this.type = 'number';
    this.subscriptions.add(
      this.value$.pipe(distinctUntilChanged(), debounceTime(500)).subscribe((value) => this.setFilter(value))
    );
  }

  setFilter(value: string) {
    super.updateFilter(value);
  }

  enterPressed($event: any) {
    this.setFilter($event.target.value);
    setTimeout(() => {
      this.pressedEnter.next();
    }, 10);
  }

  clear() {
    this.setFilter('');
    this.cleared.next();
  }
}
