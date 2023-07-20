import { Component, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  DEFAULT_NAMED_QUERY_ID,
  DEFAULT_ROWS_NUMBER,
  httpErrorOptions,
  latLonToGeographicFieldTransformation,
  PrySnackbarService,
  SearchService,
  solvingCollisionOptions
} from '@provoly/dashboard';
import { environment } from '../environments/environment';

export const SCROLLABLE_MODE = false;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  scrollable = SCROLLABLE_MODE;

  constructor(
    private store: Store<any>,
    snackbarService: PrySnackbarService,
    viewContainerRef: ViewContainerRef,
    public searchService: SearchService,
    public router: Router
  ) {
    this.store.dispatch(DashboardActions.setAvailableNamedQueries({ names: [DEFAULT_NAMED_QUERY_ID] }));
    snackbarService.setRootViewContainerRef(viewContainerRef);
    if (!environment.production) {
      httpErrorOptions.isDevMode = true;
    }
    if (SCROLLABLE_MODE) {
      solvingCollisionOptions.invertedGravity = true;
      this.store.select(DashboardSelectors.windowManifest).subscribe((manifest) => {
        const grid = document.getElementsByClassName('o-dashboard-grid')[0] as HTMLDivElement;
        if (grid) {
          grid.style.height = (manifest.grid?.rows ?? DEFAULT_ROWS_NUMBER) * 200 + 'px';
        }
      });
    }
    this.searchService.addTransformation(
      latLonToGeographicFieldTransformation('latitude', 'longitude', 'location-auto')
    );
    this.searchService.addTransformation(
      latLonToGeographicFieldTransformation('Latitude', 'Longitude', 'location-auto')
    );
  }
}
