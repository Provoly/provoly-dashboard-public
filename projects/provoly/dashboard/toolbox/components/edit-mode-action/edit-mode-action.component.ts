import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  GlobalManifest,
  ManifestDescription,
  ViewMode
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-edit-mode-toggle',
  templateUrl: './edit-mode-action.component.html'
})
export class EditModeActionComponent extends ToolboxActionComponent {
  modeEdition$: Observable<boolean>;
  presentation:
    | {
        current: ManifestDescription | undefined;
        viewMode?: ViewMode;
        initial: GlobalManifest | undefined;
      }
    | undefined;

  constructor(store: Store<any>) {
    super(store);
    this.modeEdition$ = this.store.select(DashboardSelectors.dashboardEditionMode);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((prez) => {
        this.presentation = prez;
      })
    );
  }

  toggleEditionMode() {
    this.store.dispatch(DashboardActions.toggleEditionMode({}));
  }
}
