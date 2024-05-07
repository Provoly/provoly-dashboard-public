import { Component, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions, PRY_ACCESS_TOKEN, PryBaseAccess } from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-launch-tab',
  templateUrl: './launch-tab.component.html'
})
export class LaunchTabComponent extends ToolboxActionComponent {
  constructor(store: Store, @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess) {
    super(store, access);
  }

  launchNewWindow() {
    this.store.dispatch(DashboardActions.createTab());
    this.close();
  }
}
