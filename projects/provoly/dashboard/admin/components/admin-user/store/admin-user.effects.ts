import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AdminService } from '../../../store/admin.service';
import { AdminUserActions } from './admin-user.action';

@Injectable()
export class AdminUserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminUserActions.loadUsers),
      mergeMap((_) =>
        this.adminService.getUsers().pipe(
          map((users) => AdminUserActions.loadUsersSuccess({ users })),
          catchError((error) => [AdminUserActions.loadUsersFailure({ error })])
        )
      )
    )
  );

  loadMetadataUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminUserActions.loadMetadataUser),
      mergeMap((action) =>
        this.adminService.getMetadataUser(action.userId).pipe(
          map((metadata) => AdminUserActions.loadMetadataUserSuccess({ metadata })),
          catchError((error) => [AdminUserActions.loadMetadataUserFailure({ error })])
        )
      )
    )
  );

  selectUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminUserActions.selectUser),
      map((action) => {
        return AdminUserActions.loadMetadataUser({ userId: action.userId });
      })
    )
  );

  addMetadataUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminUserActions.addMetadataUser),
      mergeMap((action) =>
        this.adminService.addMetadataUser(action.userId, action.metaId, action.value).pipe(
          map(() => AdminUserActions.addMetadataUserSuccess({ userId: action.userId })),
          catchError((error) => [AdminUserActions.addMetadataUserFailure({ error })])
        )
      )
    )
  );

  addMetadataUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminUserActions.addMetadataUserSuccess),
      mergeMap((action) => {
        return [
          AdminUserActions.loadMetadataUser({ userId: action.userId }),
          AdminUserActions.isEditable({ editable: false })
        ];
      })
    )
  );

  deleteMetadataUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminUserActions.deleteMetadataUser),
      mergeMap((action) =>
        this.adminService.deleteMetadataUser(action.userId, action.metadataId).pipe(
          map(() => AdminUserActions.deleteMetadataUserSuccess({ userId: action.userId })),
          catchError((error) => [AdminUserActions.deleteMetadataUserFailure({ error })])
        )
      )
    )
  );

  deleteMetadataUserSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminUserActions.deleteMetadataUserSuccess),
      mergeMap((action) => {
        return [
          AdminUserActions.loadMetadataUser({ userId: action.userId }),
          AdminUserActions.isEditable({ editable: false })
        ];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService
  ) {}
}
