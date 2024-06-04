import { Component, Inject, Optional } from '@angular/core';
import { DashboardActions, PRY_ACCESS_TOKEN, PryBaseAccess } from '@provoly/dashboard';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pry-delete-pres',
  templateUrl: './delete.component.html'
})
export class DeleteComponent extends ToolboxActionComponent {
  constructor(store: Store, @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess) {
    super(store, access);
  }

  trigger() {
    this.store.dispatch(DashboardActions.confirmManifestDeletion({ id: this.currentManifest?.id! }));
    this.close();
  }
}
