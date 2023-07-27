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
    const properties = ['mapUrl', 'pryUrl', 'wsUrl', 'geoServerUrl'] as (
      | 'mapUrl'
      | 'pryUrl'
      | 'wsUrl'
      | 'geoServerUrl'
    )[];

    const config = {} as { [key: string]: string };
    properties.forEach((prop) => {
      if (!!this.baseConfig[prop]) {
        config[prop] = this.baseConfig[prop]!;
      }
    });

    if (Object.keys(config).length > 0) {
      this.store.dispatch(ConfigActions.defineUrls(config));
    }

    if (!!this.baseConfig.path) {
      this.router.config.push({ path: this.baseConfig.path, component: DashboardComponent });
    }
  }
}
