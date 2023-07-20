import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardComponent,
  DashboardSelectors,
  GlobalManifest,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { combineLatest, Observable, take } from 'rxjs';
import { debounceTime, delay } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent extends SubscriptionnerDirective {
  globalManifest$: Observable<GlobalManifest>;
  @ViewChild('dashboard') dashboard!: DashboardComponent;
  DEBUG_EXPORT = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>
  ) {
    super();
    this.globalManifest$ = this.store.select(DashboardSelectors.globalManifest);
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
        })
    );
  }
}
