import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, mergeMap, tap, withLatestFrom } from 'rxjs';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { ContextMenuSelectors } from '../context-menu/context-menu.selectors';
import { ItemActions } from './item.actions';
import { ItemService } from './item.service';

@Injectable()
export class ItemEffects {
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemActions.create),
      withLatestFrom(this.store.select(ContextMenuSelectors.resultSet)),
      mergeMap(([action, resultSet]) =>
        this.service.create(action.item, action.datasetVersionId, action.mode).pipe(
          mergeMap((items) =>
            (items ?? (action.item ? [action.item] : []))
              .map((item) => [
                ItemActions.createSuccess({ id: item.id }),
                DashboardActions.addItemToResultSets({ item, resultSet })
              ])
              .reduce((a, b) => [...a, ...b], [])
          ),
          catchError((error) => [ItemActions.createFailure({ error })])
        )
      )
    )
  );

  createSuccessWarning$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ItemActions.createSuccess),
        tap((action) => {
          const actionClicked$ = this.snackBar.notMitigatedOpen({
            type: 'success',
            message: this.translateService.instant('@pry.context.createObject.created'),
            action: this.translateService.instant('@pry.context.createObject.details'),
            timeout: 10000
          });
          actionClicked$?.subscribe(() => {
            this.store.dispatch(DashboardActions.detail({ ids: [action.id] }));
          });
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private service: ItemService,
    private store: Store,
    private snackBar: PrySnackbarService,
    private translateService: PryI18nService
  ) {}
}
