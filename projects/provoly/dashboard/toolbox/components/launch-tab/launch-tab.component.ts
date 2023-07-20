import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from '@provoly/dashboard';

@Component({
  selector: 'pry-launch-tab',
  templateUrl: './launch-tab.component.html'
})
export class LaunchTabComponent {
  @Input() label = true;

  constructor(private store: Store) {}

  launchNewWindow() {
    this.store.dispatch(DashboardActions.createTab());
  }
}
