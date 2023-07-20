import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, interval, Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { SearchActions } from '../../core/store/search/search.actions';
import { DashboardSelectors } from './dashboard.selectors';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {
  subscription?: Subscription;

  constructor(private store: Store) {}

  stop() {
    this.subscription?.unsubscribe();
  }

  start() {
    if (!this.subscription) {
      this.subscription = interval(1000)
        .pipe(
          withLatestFrom(this.store.select(DashboardSelectors.refreshRates)),
          map(([interval, refreshRates]) =>
            Object.keys(refreshRates)
              .filter((key) => refreshRates[key] !== undefined && refreshRates[key] !== 0)
              .filter((key) => interval % refreshRates[key] === 0)
          ),
          filter((rs) => rs.length > 0)
        )
        .subscribe((resultSetsToUpdate) => {
          resultSetsToUpdate.forEach((rs) => {
            this.store.dispatch(SearchActions.getDatasourceItems({ id: rs }));
          });
        });
    }
  }
}
