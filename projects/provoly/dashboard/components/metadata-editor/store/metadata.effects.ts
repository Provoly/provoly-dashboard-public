import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import { MetadataActions } from './metadata.action';
import { MetadataService } from './metadata.service';

@Injectable()
export class MetadataEffects {
  loadMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.loadMetadata),
      mergeMap((_) =>
        this.service.getMetadataList().pipe(
          map((metadata) => MetadataActions.loadMetadataSuccess({ metadata: metadata })),
          catchError((error) => [MetadataActions.loadMetadataFailure({ error: error })])
        )
      )
    )
  );

  goToDetailsView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.goToDetailsView),
      mergeMap((action) =>
        this.service.getMetadata(action.id).pipe(
          map((metadata) => MetadataActions.goToDetailsViewSuccess({ metadata })),
          catchError((error) => [MetadataActions.goToDetailsViewFailure({ error: error })])
        )
      )
    )
  );

  createMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.createMetadata),
      mergeMap((action) =>
        this.service.postMetadata(action.metadata).pipe(
          map(() => MetadataActions.createMetadataSuccess({ metadata: action.metadata })),
          catchError((error) => [MetadataActions.createMetadataFailure({ error: error })])
        )
      )
    )
  );

  createMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.createMetadataSuccess),
      map((action) => {
        return MetadataActions.loadMetadata();
      })
    )
  );

  loadMetadataUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.loadMetadataUser),
      mergeMap((action) =>
        this.service.getMetadataUser(action.userId).pipe(
          map((metadata) => MetadataActions.loadMetadataUserSuccess({ metadata })),
          catchError((error) => [MetadataActions.loadMetadataUserFailure({ error })])
        )
      )
    )
  );

  selectUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Admin/User] Select User'),
      map((action) => {
        // @ts-ignore
        return MetadataActions.loadMetadataUser({ userId: action.userId });
      })
    )
  );

  addMetadataUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.addMetadataUser),
      mergeMap((action) =>
        this.service.addMetadataUser(action.userId, action.metaId, action.value).pipe(
          map(() => MetadataActions.addMetadataUserSuccess({ userId: action.userId })),
          catchError((error) => [MetadataActions.addMetadataUserFailure({ error })])
        )
      )
    )
  );

  addMetadataUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.addMetadataUserSuccess),
      mergeMap((action) => {
        return [
          MetadataActions.loadMetadataUser({ userId: action.userId }),
          MetadataActions.isEditable({ editable: false })
        ];
      })
    )
  );

  deleteMetadataUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.deleteMetadataUser),
      mergeMap((action) =>
        this.service.deleteMetadataUser(action.userId, action.metadataId).pipe(
          map(() => MetadataActions.deleteMetadataUserSuccess({ userId: action.userId })),
          catchError((error) => [MetadataActions.deleteMetadataUserFailure({ error })])
        )
      )
    )
  );

  deleteMetadataUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.deleteMetadataUserSuccess),
      mergeMap((action) => {
        return [
          MetadataActions.loadMetadataUser({ userId: action.userId }),
          MetadataActions.isEditable({ editable: false })
        ];
      })
    )
  );

  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.loadUserProfile),
      mergeMap((_) =>
        this.service.getUserMetadata().pipe(
          map((metadata) => MetadataActions.loadUserProfileSuccess({ userProfile: metadata })),
          catchError((error) => [MetadataActions.loadUserProfileFailure({ error: error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private service: MetadataService
  ) {}
}
