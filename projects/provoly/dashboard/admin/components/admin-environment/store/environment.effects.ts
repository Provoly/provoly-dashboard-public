import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { EnvironmentActions } from './environment.actions';

@Injectable()
export class EnvironmentEffects {
  loadEnvironments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnvironmentActions.loadEnvironments),
      mergeMap((action) =>
        this.service.getEnvironments().pipe(
          map((datas) => EnvironmentActions.loadEnvironmentsSuccess({ datas })),
          catchError((error) => [EnvironmentActions.loadEnvironmentsFailure({ error })])
        )
      )
    )
  );

  saveEnvironment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnvironmentActions.saveEnvironment),
      mergeMap((action) =>
        this.service.saveEnvironment(action.env).pipe(
          map(() => EnvironmentActions.saveEnvironmentSuccess({ route: action.route })),
          catchError((error) => [EnvironmentActions.saveEnvironmentFailure({ error })])
        )
      )
    )
  );

  saveEnvironmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnvironmentActions.saveEnvironmentSuccess),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
      })
    )
  );

  selectEnvironment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnvironmentActions.selectEnvironment),
      mergeMap((action) =>
        this.service.getEnvironment(action.name).pipe(
          map((data) => EnvironmentActions.selectEnvironmentSuccess({ data })),
          catchError((error) => [EnvironmentActions.selectEnvironmentFailure({ error })])
        )
      )
    )
  );

  deleteEnvironment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnvironmentActions.deleteEnvironment),
      mergeMap((action) =>
        this.service.deleteEnvironment(action.name).pipe(
          map(() => EnvironmentActions.deleteEnvironmentSuccess({ route: action.route, addRoute: action.addRoute })),
          catchError((error) => [EnvironmentActions.deleteEnvironmentFailure({ error })])
        )
      )
    )
  );

  deleteEnvironmentSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnvironmentActions.deleteEnvironmentSuccess),
      mergeMap((action) => {
        return [
          EnvironmentActions.loadEnvironments(),
          AdminActions.selectComponentType({ componentType: null }),
          AdminActions.mainActions({
            actions: [
              {
                action: AdminActions.routeTo({ path: action.addRoute }),
                label: 'add',
                icon: 'add_column',
                moduleAccess: 'admin',
                pageAccess: 'environment',
                actionAccess: 'write'
              }
            ]
          })
        ];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private router: Router
  ) {}
}
