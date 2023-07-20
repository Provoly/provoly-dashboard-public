import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FieldActions } from './field.actions';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { FieldService } from './field.service';

@Injectable()
export class FieldEffects {
  loadFields$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldActions.load),
      debounceTime(200),
      mergeMap((action) =>
        this.fieldService.getFields().pipe(
          map((fields) => FieldActions.loadSuccess({ fields })),
          catchError((error) => [FieldActions.loadFailure({ error: error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private fieldService: FieldService
  ) {}
}
