import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { PredicatesActions } from '../admin-predicates/store/predicates.actions';
import { AbacRulesActions } from './store/abac-rules.actions';
import { AbacRule } from './store/abac-rules.model';
import { AbacRulesSelectors } from './store/abac-rules.selectors';

@Component({
  selector: 'pry-admin-abac-rules',
  templateUrl: './admin-abac-rules.component.html'
})
export class AdminAbacRulesComponent {
  rules$: Observable<AbacRule[]>;
  loading$: Observable<boolean>;
  sortActive? = 'name';
  sortDirection? = 'asc';

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(AbacRulesActions.loadAbacRules());
    this.store.dispatch(PredicatesActions.loadPredicates());
    this.rules$ = this.store.select(AbacRulesSelectors.abacRules);
    this.loading$ = this.store.select(AbacRulesSelectors.loading);
    const newAbacRulePath = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: newAbacRulePath.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'abac_rules',
            actionAccess: 'write'
          }
        ]
      })
    );
  }

  goToSelectRule(rule: AbacRule) {
    const path = this.router.createUrlTree(['.', `${rule.id}`], { relativeTo: this.route });
    this.store.dispatch(AdminActions.routeTo({ path: path.toString() }));
  }
}
