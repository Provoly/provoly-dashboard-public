import { Component, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  GlobalManifest,
  ManifestDescription,
  ViewMode
} from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'pry-delete-pres',
  templateUrl: './delete.component.html'
})
export class DeleteComponent extends ToolboxActionComponent {
  presentation:
    | {
        current: ManifestDescription | undefined;
        viewMode?: ViewMode;
        initial: GlobalManifest | undefined;
      }
    | undefined;

  constructor(store: Store, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super(store);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((prez) => {
        this.presentation = prez;
      })
    );
  }

  trigger() {
    this.store.dispatch(DashboardActions.confirmManifestDeletion({ id: this.presentation?.current!.id! }));
    this.close();
  }
}
