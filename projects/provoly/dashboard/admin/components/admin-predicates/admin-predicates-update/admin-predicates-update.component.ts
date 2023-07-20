import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Predicate } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { PredicatesActions } from '../store/predicates.actions';
import { PredicatesSelectors } from '../store/predicates.selectors';

@Component({
  selector: 'pry-admin-predicates-update',
  templateUrl: './admin-predicates-update.component.html'
})
export class AdminPredicatesUpdateComponent implements OnInit {
  currentPredicate$: Observable<Predicate | undefined>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentPredicate$ = this.store.select(PredicatesSelectors.currentPredicate);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) =>
      this.store.dispatch(PredicatesActions.selectPredicate({ id: params['id'] }))
    );
  }
}
