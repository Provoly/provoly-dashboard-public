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

  constructor(private actions$: Actions, private adminService: AdminService) {}
}
