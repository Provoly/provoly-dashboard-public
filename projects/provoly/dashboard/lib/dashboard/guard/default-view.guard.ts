import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { mergeMap, Observable, of } from 'rxjs';
import { catchError, debounceTime, map, withLatestFrom } from 'rxjs/operators';
import { ConfigSelectors } from '../../core/store/config/config.selectors';
import { DashboardActions } from '../store/dashboard.actions';
import { DashboardSelectors } from '../store/dashboard.selectors';
import { ManifestService } from '../store/manifest.service';

@Injectable()
export class DefaultViewGuard implements CanActivate {
  constructor(
    private manifestService: ManifestService,
    private router: Router,
    private store: Store
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(ConfigSelectors.defaultViewGuardUsed).pipe(
      debounceTime(500),
      withLatestFrom(this.store.select(DashboardSelectors.rank)),
      mergeMap(([used, rank]) =>
        used || rank > 0
          ? of(true)
          : this.manifestService.list().pipe(
              map((descriptions) => {
                const defaultView = descriptions.find((description) => description.default);
                if (!!defaultView) {
                  this.store.dispatch(DashboardActions.loadAndActivateManifest({ id: defaultView.id }));
                  console.log(`DefaultViewGuard: opening default view ${defaultView.name}.`);
                } else {
                  console.log('DefaultViewGuard: no default view found.');
                }
                return true;
              })
            )
      ),
      catchError((err) => {
        console.error('DefaultViewGuard: error guard processing', err);
        return of(true);
      })
    );
  }
}
