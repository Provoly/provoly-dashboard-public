import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  GlobalManifest,
  ManifestDescription,
  ViewMode
} from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-switch-to-edit',
  templateUrl: './switch-to-edit-content.component.html'
})
export class SwitchToEditContentComponent extends ToolboxActionComponent {
  presentation:
    | {
        current: ManifestDescription | undefined;
        viewMode?: ViewMode;
        initial: GlobalManifest | undefined;
      }
    | undefined;

  constructor(store: Store) {
    super(store);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((prez) => {
        this.presentation = prez;
      })
    );
  }

  trigger() {
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: ViewMode.EDITION }));
    this.close();
  }
}
