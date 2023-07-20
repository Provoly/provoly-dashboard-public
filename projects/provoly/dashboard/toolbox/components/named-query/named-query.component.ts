import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardSelectors, DataSourceActions, MIME_TYPE_RESULTSET } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-named-query',
  templateUrl: './named-query.component.html'
})
export class NamedQueryComponent {
  @Input() label = true;
  displayCombo = false;
  namedQueries$: Observable<string[]>;

  constructor(private store: Store<any>) {
    this.store.dispatch(DataSourceActions.load());
    this.namedQueries$ = this.store.select(DashboardSelectors.availableNamedQueries);
  }

  toggle() {
    this.displayCombo = !this.displayCombo;
  }

  dragStart($event: DragEvent, rs: string) {
    if (!!$event && !!$event.dataTransfer && !$event.dataTransfer.types.includes(MIME_TYPE_RESULTSET)) {
      $event.dataTransfer.setData(MIME_TYPE_RESULTSET, rs);
    }
  }

  dragLeave($event: DragEvent) {
    this.toggle();
  }
}
