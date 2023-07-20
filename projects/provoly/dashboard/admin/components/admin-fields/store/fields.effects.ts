import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  FieldActions,
  FieldService,
  PryDialogConfirmComponent,
  PryDialogConfirmData,
  PryDialogService
} from '@provoly/dashboard';
import { tap } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AdminActions } from '../../../store/admin.actions';
import { FieldsActions } from './fields.actions';

@Injectable()
export class FieldsEffects {
  updateToolbox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.updateToolbox),
      mergeMap((action) => {
        return [FieldActions.load(), AdminActions.selectComponentType({ componentType: null })];
      })
    )
  );

  saveField$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.saveField),
      mergeMap((action) =>
        this.fieldService.saveField(action.field).pipe(
          map(() => FieldsActions.saveFieldSuccess({ route: action.route })),
          catchError((error) => [FieldsActions.saveFieldFailure({ error: error })])
        )
      )
    )
  );

  saveFieldSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.saveFieldSuccess),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
      })
    )
  );

  confirmFieldDeletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FieldsActions.confirmFieldDeletion),
        tap((action) => {
          const data: PryDialogConfirmData = {
            title: '@pry.admin.fields.confirmFieldDeletion',
            actions: [
              {
                id: 0,
                label: '@pry.admin.validate'
              },
              {
                id: 1,
                label: '@pry.admin.cancel',
                color: 'secondary'
              }
            ]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
        })
      ),
    { dispatch: false }
  );

  deleteField$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.deleteField),
      mergeMap((action) =>
        this.fieldService.deleteField(action.id).pipe(
          map(() => FieldsActions.deleteFieldSuccess()),
          catchError((error) => [FieldsActions.deleteFieldFailure({ error: error })])
        )
      )
    )
  );

  deleteFieldSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.deleteFieldSuccess),
      map((action) => {
        return FieldActions.load();
      })
    )
  );

  closePanelOnDeleteFieldSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.deleteFieldSuccess),
      map((action) => {
        return AdminActions.togglePanel({ panelOpen: false });
      })
    )
  );

  constructor(
    private actions$: Actions,
    private fieldService: FieldService,
    private pryDialog: PryDialogService
  ) {}
}
