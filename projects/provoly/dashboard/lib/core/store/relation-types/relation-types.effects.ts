import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { PryDialogConfirmComponent, PryDialogConfirmData } from '../../components/overlay/dialog-confirm.component';
import { PryDialogService } from '../../components/overlay/dialog.service';
import { RelationTypesActions } from './relation-types.actions';
import { RelationTypesService } from './relation-types.service';

@Injectable()
export class RelationTypesEffects {
  loadRelationsTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationTypesActions.load),
      debounceTime(100),
      mergeMap((action) =>
        this.service.getRelationsTypes().pipe(
          map((datas) => RelationTypesActions.loadSuccess({ datas })),
          catchError((error) => [RelationTypesActions.loadFailure({ error })])
        )
      )
    )
  );

  saveRelationType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationTypesActions.saveRelationType),
      mergeMap((action) =>
        this.service.addRelationType(action.id, action.name).pipe(
          map((data) => RelationTypesActions.saveRelationTypeSuccess()),
          catchError((error) => [RelationTypesActions.saveRelationTypeFailure({ error })])
        )
      )
    )
  );

  saveRelationTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationTypesActions.saveRelationTypeSuccess),
      map((action) => {
        return RelationTypesActions.load();
      })
    )
  );

  deleteRelationType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationTypesActions.deleteRelationType),
      mergeMap((action) => {
        if (!action.relationType.deletable) {
          const data: PryDialogConfirmData = {
            title: '@pry.admin.infoModalTitle',
            message: '@pry.admin.relationTypes.deleteModalMessage',
            actions: [{ id: 0, label: '@pry.admin.closeModale' }]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
          return [];
        } else {
          return this.service.deleteRelationType(action.relationType.id).pipe(
            map((data) => RelationTypesActions.deleteRelationTypeSuccess()),
            catchError((error) => [RelationTypesActions.deleteRelationTypeFailure({ error })])
          );
        }
      })
    )
  );

  createRelation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationTypesActions.createRelation),
      mergeMap((action) =>
        this.service.createRelation(action.from, action.to, action.typeId, action.inversion).pipe(
          mergeMap((relations) => [
            RelationTypesActions.createRelationSuccess(),
            DashboardActions.addRelationsToResultSets({ relations })
          ]),
          catchError((error) => [RelationTypesActions.createRelationFailure({ error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private service: RelationTypesService,
    private router: Router,
    private pryDialog: PryDialogService
  ) {}
}
