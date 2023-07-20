import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { ClassActions } from './class.actions';
import { ClassService } from './class.service';

@Injectable()
export class ClassEffects {
  loadClasses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.load),
      debounceTime(200),
      mergeMap((action) =>
        this.classService.getClasses().pipe(
          map((classes) => ClassActions.loadSuccess({ classes })),
          catchError((error) => [ClassActions.loadFailure({ error: error })])
        )
      )
    )
  );

  loadBusinessData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClassActions.loadBusinessData),
      mergeMap((action) =>
        this.classService.getBusinessDatas().pipe(
          map((businessData) => {
            return ClassActions.loadBusinessDataSuccess({ datas: businessData });
          }),
          catchError((error) => [ClassActions.loadBusinessDataFailure({ error: error })])
        )
      )
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
    private classService: ClassService
  ) {}
}
