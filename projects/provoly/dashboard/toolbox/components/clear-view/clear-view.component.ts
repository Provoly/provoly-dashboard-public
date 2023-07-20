import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from '@provoly/dashboard';

@Component({
  selector: 'pry-clear-view',
  templateUrl: './clear-view.component.html'
})
export class ClearViewComponent {
  @Input() label = true;

  constructor(private store: Store) {}

  clear() {
    this.store.dispatch(DashboardActions.clearManifest());
  }
}
