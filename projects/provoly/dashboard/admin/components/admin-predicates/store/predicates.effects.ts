import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { PredicatesActions } from './predicates.actions';

@Injectable()
export class PredicatesEffects {
  loadPredicates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PredicatesActions.loadPredicates),
      mergeMap((action) =>
        this.service.getPredicates().pipe(
          map((datas) => PredicatesActions.loadPredicatesSuccess({ datas })),
          catchError((error) => [PredicatesActions.loadPredicatesFailure({ error })])
        )
      )
    )
  );

  savePredicate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PredicatesActions.savePredicate),
      mergeMap((action) =>
        this.service.savePredicate(action.predicate).pipe(
          map(() => PredicatesActions.savePredicateSuccess({ route: action.route })),
          catchError((error) => [PredicatesActions.savePredicateFailure({ error })])
        )
      )
    )
  );

  savePredicateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PredicatesActions.savePredicateSuccess),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
      })
    )
  );

  selectPredicate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PredicatesActions.selectPredicate),
      mergeMap((action) =>
        this.service.getPredicate(action.id).pipe(
          map((data) => PredicatesActions.selectPredicateSuccess({ data })),
          catchError((error) => [PredicatesActions.selectPredicateFailure({ error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private router: Router
  ) {}
}
