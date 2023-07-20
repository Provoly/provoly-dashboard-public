import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataSourceActions, DataSourceService } from '@provoly/dashboard';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AdminDatasetActions } from './admin-dataset.actions';

@Injectable()
export class AdminDatasetEffects {
  addDatasetMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.addDatasetMetadata),
      mergeMap((action) =>
        this.dataSourceService.addDatasetMetadata(action.datasetId, action.metadataId, action.value).pipe(
          map(() => AdminDatasetActions.addDatasetMetadataSuccess({ datasetId: action.datasetId })),
          catchError((error) => [AdminDatasetActions.addDatasetMetadataFailure({ error })])
        )
      )
    )
  );

  addDatasetMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.addDatasetMetadataSuccess),
      mergeMap((action) => {
        return [
          DataSourceActions.dataset.getDatasetById({ id: action.datasetId }),
          AdminDatasetActions.isEditable({ editable: false })
        ];
      })
    )
  );

  deleteDatasetMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.deleteDatasetMetadata),
      mergeMap((action) =>
        this.dataSourceService.deleteDatasetMetadata(action.datasetId, action.metadataId).pipe(
          map(() => AdminDatasetActions.deleteDatasetMetadataSuccess({ datasetId: action.datasetId })),
          catchError((error) => [AdminDatasetActions.deleteDatasetMetadataFailure({ error })])
        )
      )
    )
  );

  deleteDatasetMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminDatasetActions.deleteDatasetMetadataSuccess),
      mergeMap((action) => {
        return [
          DataSourceActions.dataset.getDatasetById({ id: action.datasetId }),
          AdminDatasetActions.isEditable({ editable: false })
        ];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private dataSourceService: DataSourceService
  ) {}
}
