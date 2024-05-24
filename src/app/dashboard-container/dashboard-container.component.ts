import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DashboardActions, DashboardSelectors, Filter, SubscriptionnerDirective } from '@provoly/dashboard';
import { combineLatest, take } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent extends SubscriptionnerDirective implements OnDestroy {
  DEBUG_EXPORT = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>
  ) {
    super();
    this.subscriptions.add(
      combineLatest([
        this.store.select(DashboardSelectors.windowManifest),
        this.route.data.pipe(delay(10)),
        this.route.queryParams.pipe(delay(10))
      ])
        .pipe(debounceTime(500), take(1))
        .subscribe(([manifest, data, params]) => {
          if (data['manifest']) {
            this.store.dispatch(
              DashboardActions.updateDashboardManifest({
                manifest: data['manifest']
              })
            );
          }
          if (data['filters']) {
            data['filters'].forEach((filter: Filter) =>
              this.store.dispatch(DashboardActions.updateFilters({ filter: filter }))
            );
          }
        })
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(
      DashboardActions.updateDashboardManifest({
        manifest: { widgets: [] }
      })
    );
  }
}
