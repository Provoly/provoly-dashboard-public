import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataSourceActions, DataSourceService, RelationTypesActions, ShareConflict } from '@provoly/dashboard';
import { MetadataActions } from '@provoly/dashboard/components/metadata-editor';
import { catchError, map, mergeMap, switchMap } from 'rxjs';
import { AdminActions } from './admin.actions';
import { AdminService } from './admin.service';
import { Action } from '@ngrx/store';

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

  goToNewMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.goToNewMetadata),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
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

  fetchClassAssociations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.fetchClassAssociations),
      mergeMap((action) =>
        this.service.getClassAssociations(action.id).pipe(
          map((association) => AdminActions.fetchAssociationsSuccess({ association })),
          catchError((error) => [AdminActions.fetchAssociationsFailure({ error: error })])
        )
      )
    )
  );
  fetchFieldAssociations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.fetchFieldAssociations),
      mergeMap((action) =>
        this.service.getFieldAssociations(action.id).pipe(
          map((association) => AdminActions.fetchAssociationsSuccess({ association })),
          catchError((error) => [AdminActions.fetchAssociationsFailure({ error: error })])
        )
      )
    )
  );
  fetchDatasetAssociations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.fetchDatasetAssociations),
      mergeMap((action) =>
        this.service.getDatasetAssociations(action.id).pipe(
          map((association) => AdminActions.fetchAssociationsSuccess({ association })),
          catchError((error) => [AdminActions.fetchAssociationsFailure({ error: error })])
        )
      )
    )
  );
  fetchAttributeAssociations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.fetchAttributeAssociations),
      mergeMap((action) =>
        this.service.getAttributeAssociations(action.id).pipe(
          map((association) => AdminActions.fetchAssociationsSuccess({ association })),
          catchError((error) => [AdminActions.fetchAssociationsFailure({ error: error })])
        )
      )
    )
  );

  // TODO move this effect into an admin-datasource store (provoly-dashboard#586)
  updateDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.update),
      switchMap((action) =>
        this.dsService.updateDataset(action.dataset).pipe(
          mergeMap((conflict?: ShareConflict) => {
            let actions: Action[] = [
              DataSourceActions.dataset.setConflictGroups({ conflictGroups: conflict?.conflictGroupsByEntity }),
              DataSourceActions.dataset.loadDataset()
            ];
            if (action.route)
              actions.push(DataSourceActions.dataset.unselectDataset(), AdminActions.routeTo({ path: action.route }));
            return actions;
          })
        )
      ),
      catchError((error: any) => [DataSourceActions.dataset.failure({ error })])
    )
  );

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private router: Router,
    private dsService: DataSourceService
  ) {}
}
