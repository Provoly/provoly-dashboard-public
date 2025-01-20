import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { ClassActions } from './class.actions';
import { ClassService } from './class.service';
import { Store } from '@ngrx/store';
import { ClassSelectors } from './class.selectors';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';

@Injectable()
export class ClassEffects {
  loadClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.load),
      withLatestFrom(this.store.select(ClassSelectors.classes), this.store.select(DashboardSelectors.rank)),
      debounceTime(200),
      filter(([action, classes, rank]) => action.force || classes.length === 0),
      mergeMap(([action, classes, rank]) => {
        if (rank === 0) {
          return this.classService.getClasses().pipe(
            map((classes) => ClassActions.loadSuccess({ classes })),
            catchError((error) => [ClassActions.loadFailure({ error: error })])
          );
        } else {
          return of(ClassActions.requestUpdate());
        }
      })
    )
  );

  requestUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.requestUpdate),
      withLatestFrom(this.store.select(ClassSelectors.classes), this.store.select(DashboardSelectors.rank)),
      filter(([_, classes, rank]) => rank === 0),
      map(([_, classes, rank]) => ClassActions.loadSuccess({ classes }))
    )
  );

  loadDatasetCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.loadDatasetCount),
      mergeMap((action) =>
        this.classService.getDatasetCounts().pipe(
          map((datasetCounts) => {
            return ClassActions.loadDatasetCountSuccess({ datasetCounts: datasetCounts });
          }),
          catchError((error) => [ClassActions.loadDatasetCountFailure({ error: error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private classService: ClassService,
    private store: Store
  ) {}
}
