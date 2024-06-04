import { Component, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  PRY_ACCESS_TOKEN,
  PryAccessRightsShareModalComponent,
  PryBaseAccess,
  PryDialogService
} from '@provoly/dashboard';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-share-pres',
  templateUrl: './share.component.html'
})
export class ShareComponent extends ToolboxActionComponent {
  constructor(
    store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess,
    private dialog: PryDialogService
  ) {
    super(store, access);
  }

  trigger() {
    this.dialog.open(PryAccessRightsShareModalComponent, {
      hasBackdrop: true,
      panelClass: ['o-modal-wrapper'],
      backdropClass: 'backdrop',
      data: { manifest: this.currentManifest }
    });
  }
}
