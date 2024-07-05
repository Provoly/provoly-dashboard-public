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
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { AdminActions } from '../../../store/admin.actions';
import { FieldsActions } from './fields.actions';
import { MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { Store } from '@ngrx/store';

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
          catchError((error) => [FieldsActions.failure({ error: error })])
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

  updateField$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.updateField),
      mergeMap((action) =>
        this.fieldService.updateField(action.field).pipe(
          map(() => FieldsActions.updateFieldSuccess({ route: action.route })),
          catchError((error) => [FieldsActions.failure({ error: error })])
        )
      )
    )
  );

  updateFieldSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FieldsActions.updateFieldSuccess),
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
                label: '@pry.admin.validate',
                actions: [FieldsActions.deleteField({ id: action.id, route: action.path })]
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
          catchError((error) => [FieldsActions.failure({ error: error })])
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
    private pryDialog: PryDialogService,
    private store: Store<any>
  ) {}
}
