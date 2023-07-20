import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfigActions } from '../../core/store/config/config.actions';
import { DashboardComponent } from '../components/dashboard.component';

export const BASE_CONFIG = new InjectionToken<string>('base config');

@Injectable({
  providedIn: 'root'
})
export class DashboardInitService {
  constructor(
    private store: Store<any>,
    private router: Router,
    @Inject(BASE_CONFIG)
    private baseConfig: { mapUrl?: string; pryUrl?: string; path?: string; wsUrl?: string; geoServerUrl?: string }
  ) {}

  init() {
    this.store.dispatch(
      ConfigActions.defineUrls({
        mapUrl: this.baseConfig.mapUrl,
        pryUrl: this.baseConfig.pryUrl,
        wsUrl: this.baseConfig.wsUrl,
        geoServerUrl: this.baseConfig.geoServerUrl
      })
    );

    if (!!this.baseConfig.path) {
      this.router.config.push({ path: this.baseConfig.path, component: DashboardComponent });
    }
  }
}
