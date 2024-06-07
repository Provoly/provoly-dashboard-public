import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  Dataset,
  DataSourceActions,
  PryDialogConfirmComponent,
  PryDialogConfirmData,
  PryDialogService,
  ShareConflict
} from '@provoly/dashboard';
import { map, mergeMap, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminDatasetActions } from './admin-dataset.actions';
import { Action } from '@ngrx/store';
import { AdminActions } from '../../../store/admin.actions';
import { AdminDatasetService } from './admin-dataset.service';
import { MetadataActions } from '@provoly/dashboard/components/metadata-editor';

@Injectable()
export class AdminDatasetEffects {
  constructor(
    private actions$: Actions,
    private datasetService: AdminDatasetService,
    private pryDialog: PryDialogService
  ) {}

  createDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.create),
      switchMap((props: { dataset: Dataset; route: string }) =>
        this.datasetService
          .addDataset(props.dataset)
          .pipe(
            mergeMap(() => [
              DataSourceActions.dataset.loadDataset(),
              AdminDatasetActions.unselectDataset(),
              AdminActions.routeTo({ path: props.route })
            ])
          )
      ),
      catchError((error: any) => [AdminDatasetActions.failure({ error })])
    )
  );

  confirmDatasetDeletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AdminDatasetActions.confirmDatasetDeletion),
        tap((action) => {
          const data: PryDialogConfirmData = {
            title: '@pry.admin.infoModalTitle',
            message: '@pry.admin.dataset.delete',
            actions: [
              {
                id: 0,
                label: '@pry.admin.delete',
                actions: [
                  AdminDatasetActions.delete({
                    name: action.name,
                    route: action.route,
                    addRoute: action.addRoute
                  })
                ]
              },
              { id: 0, label: '@pry.admin.cancel' }
            ]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
        })
      ),
    { dispatch: false }
  );

  deleteDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.delete),
      switchMap((action) =>
        this.datasetService.deleteDataset(action.name).pipe(
          mergeMap(() => [
            DataSourceActions.dataset.loadDataset(),
            AdminDatasetActions.unselectDataset(),
            AdminDatasetActions.deleted({ addRoute: action.addRoute })
          ]),
          catchError((error) => [AdminDatasetActions.failure({ error })])
        )
      )
    )
  );

  getDatasetById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.getDatasetById),
      mergeMap((action) =>
        this.datasetService.getDatasetById(action.id).pipe(
          map((data) => AdminDatasetActions.getDatasetByIdSuccess({ data })),
          catchError((error) => [AdminDatasetActions.getDatasetByIdFailure({ error })])
        )
      )
    )
  );

  unsetMissingGroupsOnDatasetSelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.selectDataset),
      mergeMap((action) => [
        AdminDatasetActions.setMissingGroups({ missingGroups: undefined }),
        DataSourceActions.dataset.listVersionsByDatasetId({ id: action.dataset.id })
      ])
    )
  );

  deleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.deleted),
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

  updateDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.update),
      switchMap((action) =>
        this.datasetService.updateDataset(action.dataset).pipe(
          mergeMap((conflict?: ShareConflict) => {
            let actions: Action[] = [
              AdminDatasetActions.setMissingGroups({ missingGroups: conflict?.missingGroupsByEntity }),
              DataSourceActions.dataset.loadDataset()
            ];
            if (action.route)
              actions.push(AdminDatasetActions.unselectDataset(), AdminActions.routeTo({ path: action.route }));
            return actions;
          })
        )
      ),
      catchError((error: any) => [DataSourceActions.dataset.failure({ error })])
    )
  );

  addDatasetMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.addDatasetMetadata),
      mergeMap((action) =>
        this.datasetService.addDatasetMetadata(action.datasetId, action.metadataId, action.value).pipe(
          map(() => MetadataActions.addDatasetMetadataSuccess({ datasetId: action.datasetId })),
          catchError((error) => [MetadataActions.addDatasetMetadataFailure({ error })])
        )
      )
    )
  );

  addDatasetMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.addDatasetMetadataSuccess),
      mergeMap((action) => {
        return [
          AdminDatasetActions.getDatasetById({ id: action.datasetId }),
          MetadataActions.isEditable({ editable: false }),
          DataSourceActions.dataset.loadDataset()
        ];
      })
    )
  );

  deleteDatasetMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.deleteDatasetMetadata),
      mergeMap((action) =>
        this.datasetService.deleteDatasetMetadata(action.datasetId, action.metadataId).pipe(
          map(() => MetadataActions.deleteDatasetMetadataSuccess({ datasetId: action.datasetId })),
          catchError((error) => [MetadataActions.deleteDatasetMetadataFailure({ error })])
        )
      )
    )
  );

  deleteDatasetMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.deleteDatasetMetadataSuccess),
      mergeMap((action) => {
        return [
          AdminDatasetActions.getDatasetById({ id: action.datasetId }),
          MetadataActions.isEditable({ editable: false }),
          DataSourceActions.dataset.loadDataset()
        ];
      })
    )
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.addCategory),
      mergeMap((action) =>
        this.datasetService.addCategory(action.category).pipe(
          map(() => DataSourceActions.dataset.getCategories()),
          catchError((error) => [AdminDatasetActions.failure({ error })])
        )
      )
    )
  );
}
