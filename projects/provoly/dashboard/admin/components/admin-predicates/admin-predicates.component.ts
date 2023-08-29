import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Predicate } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { PredicatesActions } from './store/predicates.actions';
import { PredicatesSelectors } from './store/predicates.selectors';

@Component({
  selector: 'pry-admin-predicates',
  templateUrl: './admin-predicates.component.html'
})
export class AdminPredicatesComponent {
  predicates$: Observable<Predicate[]>;
  loading$: Observable<boolean>;
  currentPredicateId$: Observable<string | undefined>;

  sortActive? = 'name';
  sortDirection? = 'asc';

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.store.dispatch(PredicatesActions.loadPredicates());
    this.predicates$ = this.store.select(PredicatesSelectors.predicates);
    this.loading$ = this.store.select(PredicatesSelectors.loading);
    const path = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
    this.currentPredicateId$ = this.store.select(PredicatesSelectors.currentPredicateId);
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'predicates',
            actionAccess: 'write'
          }
        ]
      })
    );
  }

  goToSelectPredicate(num: string) {
    this.store.dispatch(PredicatesActions.selectPredicate({ id: num }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminPredicatesSelectComponent' }));
  }
}
