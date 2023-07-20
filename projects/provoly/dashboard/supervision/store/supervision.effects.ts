import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PryI18nService, PrySnackbarService } from '@provoly/dashboard';
import { interval, switchMap, takeUntil } from 'rxjs';
import { catchError, map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { SupervisionActions } from './supervision.actions';
import { SupervisionState } from './supervision.reducer';
import { SupervisionSelectors } from './supervision.selectors';
import { SupervisionService } from './supervision.service';

@Injectable()
export class SupervisionEffects {
  routeTo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.routeTo),
      mergeMap((action) => {
        this.router.navigate([action.path], { queryParams: action.params });
        return action.path === this.router.url ? [] : [SupervisionActions.resetActions()];
      })
    )
  );

  loadInfras$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.loadInfras),
      mergeMap((action) =>
        this.service.getInfrastructures().pipe(
          map((infras) => SupervisionActions.loadInfrasSuccess({ infras })),
          catchError((error) => [SupervisionActions.loadInfrasFailure({ error: error })])
        )
      )
    )
  );

  scaleInfra$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.scaleInfra),
      mergeMap((action) =>
        this.service.scaleInfra(action.name, action.scale).pipe(
          map(() =>
            SupervisionActions.scaleInfraSuccess({ name: action.name, time: this.service.getDateIso(), up: action.up })
          ),
          catchError((error) => [SupervisionActions.scaleInfraFailure({ error: error })])
        )
      )
    )
  );

  scaleInfraSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.scaleInfraSuccess),
      map((action) => {
        this.snackbar.open({
          message: this.translateService.instant('@pry.supervision.infrastructures.scaleMsg'),
          type: 'info'
        });
        return SupervisionActions.loadInfras();
      })
    )
  );

  loadFlows$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.loadFlows),
      mergeMap((action) =>
        this.service.getInputFlows().pipe(
          map((flows) => SupervisionActions.loadFlowsSuccess({ flows })),
          catchError((error) => [SupervisionActions.loadFlowsFailure({ error: error })])
        )
      )
    )
  );

  loadIntegrationErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.loadIntegrationErrors),
      mergeMap((action) =>
        this.service.getIntegrationErrors().pipe(
          map((integrationErrors) =>
            SupervisionActions.loadIntegrationErrorsSuccess({ integrationErrors: integrationErrors })
          ),
          catchError((error) => [SupervisionActions.loadIntegrationErrorsFailure({ error: error })])
        )
      )
    )
  );

  reloadErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.reloadErrors),
      withLatestFrom(this.store.select(SupervisionSelectors.selectedClasses)),
      mergeMap(([action, classes]) =>
        this.service.reloadErrors(classes).pipe(
          map(() => SupervisionActions.reloadErrorsSuccess()),
          catchError((error) => [SupervisionActions.reloadErrorsFailure({ error: error })])
        )
      )
    )
  );

  reloadErrorsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.reloadErrorsSuccess),
      map((action) => {
        this.snackbar.open({
          message: 'Errors have been reloaded',
          type: 'info'
        });
        return SupervisionActions.loadIntegrationErrors();
      })
    )
  );

  acknowledgeErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.acknowledgeErrors),
      withLatestFrom(this.store.select(SupervisionSelectors.selectedClasses)),
      mergeMap(([action, classes]) =>
        this.service.acknowledgeErrors(classes).pipe(
          map(() => SupervisionActions.acknowledgeErrorsSuccess()),
          catchError((error) => [SupervisionActions.acknowledgeErrorsFailure({ error: error })])
        )
      )
    )
  );

  acknowledgeErrorsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.acknowledgeErrorsSuccess),
      map((action) => {
        this.snackbar.open({
          message: 'Errors have been acknowledged',
          type: 'info'
        });
        return SupervisionActions.loadIntegrationErrors();
      })
    )
  );

  errorAutoRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SupervisionActions.startAutoRefresh, SupervisionActions.setRefreshInterval),
      withLatestFrom(this.store.select(SupervisionSelectors.refreshInterval)),
      switchMap(([action, refreshInterval]) =>
        interval(refreshInterval).pipe(takeUntil(this.actions$.pipe(ofType(SupervisionActions.stopAutoRefresh))))
      ),
      map((_) => SupervisionActions.loadIntegrationErrors())
    )
  );

  constructor(
    private actions$: Actions,
    private service: SupervisionService,
    private router: Router,
    private snackbar: PrySnackbarService,
    private translateService: PryI18nService,
    private store: Store<SupervisionState>
  ) {}
}
