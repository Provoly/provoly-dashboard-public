import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ENV_OPTIONS, Environment } from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { EnvironmentActions } from '../store/environment.actions';
import { EnvironmentSelectors } from '../store/environment.selectors';

@Component({
  selector: 'pry-admin-environment-select',
  templateUrl: './admin-environment-select.component.html'
})
export class AdminEnvironmentSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminEnvironmentSelectComponent';
  currentEnv$: Observable<Environment | undefined>;
  sub = new Subscription();
  currentTypeTranslation = '';

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.currentEnv$ = this.store.select(EnvironmentSelectors.currentEnv);
    this.sub.add(
      this.currentEnv$.subscribe((ce) => {
        const type = ENV_OPTIONS.find((el) => el.varType === ce?.type);
        this.currentTypeTranslation = type ? type.translation : ENV_OPTIONS[0].translation;
      })
    );
  }

  ngOnInit(): void {
    this.sub.add(
      this.currentEnv$.subscribe((env) => {
        if (env) {
          const editPath = this.router.createUrlTree(['.', 'environment', 'edit', env.name], {
            relativeTo: this.route
          });
          const envsPath = this.router.createUrlTree(['.', 'environment'], { relativeTo: this.route });
          const addPath = this.router.createUrlTree(['.', 'environment', 'new'], { relativeTo: this.route });
          this.store.dispatch(
            AdminActions.mainActions({
              actions: [
                {
                  action: AdminActions.routeTo({ path: editPath.toString() }),
                  label: 'edit',
                  icon: 'edit',
                  moduleAccess: 'admin',
                  pageAccess: 'environment',
                  actionAccess: 'write'
                },
                {
                  action: EnvironmentActions.deleteEnvironment({
                    name: env.name,
                    route: envsPath.toString(),
                    addRoute: addPath.toString()
                  }),
                  label: 'delete',
                  icon: 'delete',
                  moduleAccess: 'admin',
                  pageAccess: 'environment',
                  actionAccess: 'write'
                }
              ]
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  closePanel() {
    const path = this.router.createUrlTree(['.', 'environment', 'new'], { relativeTo: this.route });
    this.store.dispatch(EnvironmentActions.loadEnvironments());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
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
  }
}
