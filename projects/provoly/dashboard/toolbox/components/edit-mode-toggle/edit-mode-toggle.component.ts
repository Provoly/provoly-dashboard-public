import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardActions, DashboardSelectors } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-edit-mode-toggle',
  templateUrl: './edit-mode-toggle.component.html'
})
export class EditModeToggleComponent {
  @Input() label = true;
  modeEdition$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.modeEdition$ = this.store.select(DashboardSelectors.dashboardEditionMode);
  }

  toggleEditionMode() {
    this.store.dispatch(DashboardActions.toggleEditionMode({}));
  }
}
