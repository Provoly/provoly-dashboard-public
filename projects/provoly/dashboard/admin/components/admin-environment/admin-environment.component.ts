import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ENV_OPTIONS, Environment } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { EnvironmentActions } from './store/environment.actions';
import { EnvironmentSelectors } from './store/environment.selectors';

@Component({
  selector: 'pry-admin-environment',
  templateUrl: './admin-environment.component.html'
})
export class AdminEnvironmentComponent {
  environments$: Observable<Environment[]>;
  loading$: Observable<boolean>;

  sortActive? = 'name';
  sortDirection? = 'asc';
  currentEnvName$: Observable<string | undefined>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    const path = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
    this.currentEnvName$ = this.store.select(EnvironmentSelectors.currentEnvName);
    this.store.dispatch(EnvironmentActions.loadEnvironments());
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'environment',
            actionAccess: 'write'
          }
        ]
      })
    );
    this.environments$ = this.store.select(EnvironmentSelectors.environments);
    this.loading$ = this.store.select(EnvironmentSelectors.loading);
  }

  goToSelectEnv(env: Environment) {
    this.store.dispatch(EnvironmentActions.selectEnvironment({ name: env.name }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminEnvironmentSelectComponent' }));
  }

  getTranslationType(type: string) {
    return ENV_OPTIONS.find((el) => el.varType === type)?.translation || 'undefined';
  }
}
