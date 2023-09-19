import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Predicate } from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { PredicatesActions } from '../store/predicates.actions';
import { PredicatesSelectors } from '../store/predicates.selectors';

@Component({
  selector: 'pry-admin-predicates-select',
  templateUrl: './admin-predicates-select.component.html'
})
export class AdminPredicatesSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminPredicatesSelectComponent';
  currentPredicate$: Observable<Predicate | undefined>;
  sub = new Subscription();

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.currentPredicate$ = this.store.select(PredicatesSelectors.currentPredicate);
  }

  ngOnInit(): void {
    this.sub.add(
      this.currentPredicate$.subscribe((pred) => {
        if (pred) {
          const editPath = this.router.createUrlTree(['.', 'predicates', 'edit', pred.id], { relativeTo: this.route });
          this.store.dispatch(
            AdminActions.mainActions({
              actions: [
                {
                  action: AdminActions.routeTo({ path: editPath.toString() }),
                  label: 'edit',
                  icon: 'edit',
                  moduleAccess: 'admin',
                  pageAccess: 'predicates',
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
    const path = this.router.createUrlTree(['.', 'predicates', 'new'], { relativeTo: this.route });
    this.store.dispatch(PredicatesActions.loadPredicates());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
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
}
