import { Component, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions, DashboardSelectors, PRY_ACCESS_TOKEN, PryBaseAccess } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-edit-mode-action',
  templateUrl: './edit-mode-action.component.html'
})
export class EditModeActionComponent extends ToolboxActionComponent {
  modeEdition$: Observable<boolean>;

  constructor(store: Store<any>, @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess) {
    super(store, access);
    this.modeEdition$ = this.store.select(DashboardSelectors.dashboardEditionMode);
  }

  toggleEditionMode() {
    this.store.dispatch(DashboardActions.toggleEditionMode({}));
  }
}
