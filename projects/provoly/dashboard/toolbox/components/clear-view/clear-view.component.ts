import { Component, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions, PRY_ACCESS_TOKEN, PryBaseAccess } from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-clear-view',
  templateUrl: './clear-view.component.html'
})
export class ClearViewComponent extends ToolboxActionComponent {
  constructor(store: Store, @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess) {
    super(store, access);
  }

  clear() {
    this.store.dispatch(DashboardActions.clearManifest());
    this.close();
  }
}
