import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardGridLayout, DashboardSelectors } from '@provoly/dashboard';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'pry-toolbox',
  templateUrl: './toolbox.component.html'
})
export class ToolboxComponent {
  @Input() labels = true;
  hasInitialPresentation$: Observable<boolean>;
  isManualMode$: Observable<boolean>;

  constructor(store: Store) {
    this.hasInitialPresentation$ = store.select(DashboardSelectors.presentation).pipe(map((pres) => !!pres.initial));
    this.isManualMode$ = store
      .select(DashboardSelectors.windowManifest)
      .pipe(map((pres) => (pres.grid?.layout ?? DashboardGridLayout.MANUAL) === DashboardGridLayout.MANUAL));
  }
}
