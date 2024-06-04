import { Component, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions, PRY_ACCESS_TOKEN, PryBaseAccess, ViewMode } from '@provoly/dashboard';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-switch-to-edit',
  templateUrl: './switch-to-edit-content.component.html'
})
export class SwitchToEditContentComponent extends ToolboxActionComponent {
  constructor(store: Store, @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess) {
    super(store, access);
  }

  trigger() {
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: ViewMode.EDITION }));
    this.close();
  }
}
