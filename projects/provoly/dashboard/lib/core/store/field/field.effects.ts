import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FieldActions } from './field.actions';
import { catchError, debounceTime, filter, map, mergeMap, withLatestFrom } from 'rxjs';
import { FieldService } from './field.service';
import { FieldSelectors } from './field.selectors';
import { Store } from '@ngrx/store';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';

@Injectable()
export class FieldEffects {
  loadFields$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldActions.load),
      withLatestFrom(this.store.select(FieldSelectors.fields), this.store.select(DashboardSelectors.rank)),
      debounceTime(200),
      filter(([action, fields, rank]) => (action.force || fields.length === 0) && rank === 0),
      mergeMap(() =>
        this.fieldService.getFields().pipe(
          map((fields) => FieldActions.loadSuccess({ fields })),
          catchError((error) => [FieldActions.loadFailure({ error: error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private fieldService: FieldService,
    private store: Store
  ) {}
}
