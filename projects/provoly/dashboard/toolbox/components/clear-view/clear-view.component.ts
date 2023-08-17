import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions } from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-clear-view',
  templateUrl: './clear-view.component.html'
})
export class ClearViewComponent extends ToolboxActionComponent {
  constructor(store: Store) {
    super(store);
  }

  clear() {
    this.store.dispatch(DashboardActions.clearManifest());
  }
}
