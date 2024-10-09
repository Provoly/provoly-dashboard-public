import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent } from '@provoly/dashboard';
import { debounceTime, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'pry-text-filter',
  templateUrl: './text-filter.component.html'
})
export class TextFilterComponent extends BaseFilterComponent {
  value$ = new Subject<string | undefined>();

  constructor(store: Store) {
    super(store);
    this.type = 'text';
    this.subscriptions.add(
      this.value$.pipe(distinctUntilChanged(), debounceTime(500)).subscribe((value) => this.setFilter(value))
    );
  }

  setFilter(value: string | undefined) {
    super.updateFilter(value);
  }

  valueChange($event: any) {
    this.value$.next($event);
  }

  enterPressed($event: any) {
    this.setFilter($event.target.value);
    setTimeout(() => {
      this.pressedEnter.next();
    }, 10);
  }
}
