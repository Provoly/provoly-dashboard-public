import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { DashboardSelectors, ManifestDescription } from '@provoly/dashboard';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

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
      offsetY: 5,
      offsetX: 200
    }
  ];
  currentPresentation$: Observable<ManifestDescription | undefined>;

  constructor(store: Store) {
    super(store);

    this.currentPresentation$ = this.store
      .select(DashboardSelectors.presentation)
      .pipe(map((presentation) => presentation.current));
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
