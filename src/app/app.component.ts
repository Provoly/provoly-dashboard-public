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
  drodpownActions = [
    { name: 'save_view_as', order: 1 },
    { name: 'filter_settings', order: 2 },
    { name: 'default_size', order: 3 },
    { name: 'new_tab', order: 4 },
    { name: 'automate_refresh', order: 5 },
    { name: 'clear_view', order: 6 },
    { name: 'edit_presentation_content', order: 7 },
    { name: 'share', order: 8 },
    { name: 'delete', order: 9 }
  ];

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
