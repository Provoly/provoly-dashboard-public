import { Component, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import { PRY_ACCESS_TOKEN, PryBaseAccess } from '@provoly/dashboard';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-dashboard-details',
  templateUrl: './dashboard-details.component.html'
})
export class DashboardDetailsComponent extends ToolboxActionComponent {
  isPanelOpen = false;
  panelPosition: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 5
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 5
    }
  ];

  constructor(store: Store, @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess) {
    super(store, access);
  }

  openPanel($event: Event) {
    this.isPanelOpen = true;
    $event.stopPropagation();
  }

  closePanel($event: Event | void) {
    this.isPanelOpen = false;
    if ($event) $event.stopPropagation();
  }
}
