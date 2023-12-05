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
          withLatestFrom(
            this.store.select(DashboardSelectors.refreshRates),
            this.store.select(DashboardSelectors.manifestDatasources)
          ),
          map(([interval, refreshRates, datasources]) =>
            Object.keys(refreshRates)
              .filter((key) => datasources.map((ds) => ds.datasetId).includes(key))
              .filter((key) => refreshRates[key] !== undefined && refreshRates[key] !== 0)
              .filter((key) => interval % refreshRates[key] === 0)
              .map((dsId) => datasources.find((ds) => ds.datasetId === dsId)!)
          ),
          filter((rs) => rs.length > 0)
        )
        .subscribe((resultSetsToUpdate) => {
          resultSetsToUpdate.forEach((rs) => {
            this.store.dispatch(
              SearchActions.getDatasourceItems({
                id: rs.datasetId,
                excludeGeo: rs.excludeGeo,
                from: 'RefreshService.start()'
              })
            );
          });
        });
    }
  }
}
