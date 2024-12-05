import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MetadataActions } from '@provoly/dashboard/components/metadata-editor';
import { catchError, map, mergeMap } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { AdminMetadataUserActions } from './admin-metadata-user.action';

@Injectable()
export class AdminMetadataUserEffects {
  goToDetailsView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataUserActions.goToDetailsViewMetadata),
      mergeMap((action) =>
        this.adminService.getUserMetadataDef(action.id).pipe(
          map((metadata) => AdminMetadataUserActions.goToDetailsViewMetadataSuccess({ metadata })),
          catchError((error) => [AdminMetadataUserActions.goToDetailsViewMetadataFailure({ error: error })])
        )
      )
    )
  );

  switchToEditView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataUserActions.goToEditMetadata),
      mergeMap((action) =>
        this.adminService.getUserMetadataDef(action.id).pipe(
          map((metadata) => AdminMetadataUserActions.goToEditMetadataSuccess({ metadata, route: action.route })),
          catchError((error) => [AdminMetadataUserActions.goToEditMetadataFailure({ error: error })])
        )
      )
    )
  );

  goToEditViewSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataUserActions.goToEditMetadataSuccess),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
      })
    )
  );

  createMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataUserActions.createMetadata),
      mergeMap((action) =>
        this.adminService.postUserMetadata(action.metadata).pipe(
          map(() => AdminMetadataUserActions.createMetadataSuccess({ metadata: action.metadata })),
          catchError((error) => [AdminMetadataUserActions.createMetadataFailure({ error: error })])
        )
      )
    )
  );

  createMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataUserActions.createMetadataSuccess),
      map((action) => {
        return MetadataActions.loadUserProfile();
      })
    )
  );

  updateMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataUserActions.updateMetadata),
      mergeMap((action) =>
        this.adminService.postUserMetadata(action.metadata).pipe(
          map(() => AdminMetadataUserActions.updateMetadataSuccess({ metadata: action.metadata })),
          catchError((error) => [AdminMetadataUserActions.updateMetadataFailure({ error: error })])
        )
      )
    )
  );

  updateMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataUserActions.updateMetadataSuccess),
      map((action) => {
        return MetadataActions.loadUserProfile();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private store: Store<any>,
    private router: Router
  ) {}
}
