import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataSourceActions, RelationTypesActions } from '@provoly/dashboard';
import { map, mergeMap } from 'rxjs/operators';
import { AdminActions } from './admin.actions';
import { AdminService } from './admin.service';

@Injectable()
export class AdminEffects {
  routeTo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.routeTo, DataSourceActions.dataset.created, DataSourceActions.dataset.updated),
      mergeMap((action) => {
        this.router.navigate([action.path], { queryParams: action.params });
        return action.path === this.router.url ? [] : [AdminActions.resetActions()];
      })
    )
  );

  deleteRelationTypeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RelationTypesActions.deleteRelationTypeSuccess),
      mergeMap((action) => {
        return [
          RelationTypesActions.load(),
          AdminActions.selectComponentType({ componentType: null }),
          AdminActions.mainActions({
            actions: [
              {
                action: RelationTypesActions.openModal(),
                label: 'add',
                icon: 'add_column',
                moduleAccess: 'admin',
                pageAccess: 'relation_types',
                actionAccess: 'write'
              }
            ]
          })
        ];
      })
    )
  );

  closePanel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.highlightMenu),
      mergeMap((action) => {
        return [AdminActions.togglePanel({ panelOpen: false })];
      })
    )
  );

  deleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.deleted),
      mergeMap((action) => [
        AdminActions.togglePanel({ panelOpen: false }),
        AdminActions.selectComponentType({ componentType: null }),
        AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: action.addRoute }),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'dataset',
              actionAccess: 'write'
            }
          ]
        })
      ])
    )
  );

  openNewDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.openNewDataset),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
      })
    )
  );

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private router: Router
  ) {}
}
