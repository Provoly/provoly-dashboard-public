import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions, DashboardSelectors } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-edit-mode-toggle',
  templateUrl: './edit-mode-toggle.component.html'
})
export class EditModeToggleComponent extends ToolboxActionComponent {
  modeEdition$: Observable<boolean>;

  constructor(store: Store<any>) {
    super(store);
    this.modeEdition$ = this.store.select(DashboardSelectors.dashboardEditionMode);
  }

  toggleEditionMode() {
    this.store.dispatch(DashboardActions.toggleEditionMode({}));
  }
}
