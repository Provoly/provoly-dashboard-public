import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-launch-tab',
  templateUrl: './launch-tab.component.html'
})
export class LaunchTabComponent extends ToolboxActionComponent {
  constructor(store: Store) {
    super(store);
  }

  launchNewWindow() {
    this.store.dispatch(DashboardActions.createTab());
  }
}
