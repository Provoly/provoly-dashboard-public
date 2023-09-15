import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DataSourceActions, DataSourceService } from '@provoly/dashboard';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AdminActions } from '../../../admin/store/admin.actions';
import { MetadataActions } from './metadata.action';
import { MetadataService } from './metadata.service';

@Injectable()
export class MetadataEffects {
  loadMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.loadMetadata),
      mergeMap((_) =>
        this.service.getMetadataList().pipe(
          map((metadata) => MetadataActions.loadMetadataSuccess({ metadata: metadata })),
          catchError((error) => [MetadataActions.loadMetadataFailure({ error: error })])
        )
      )
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

  goToDetailsView$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.goToDetailsView),
      mergeMap((action) =>
        this.service.getMetadata(action.id).pipe(
          map((metadata) => MetadataActions.goToDetailsViewSuccess({ metadata })),
          catchError((error) => [MetadataActions.goToDetailsViewFailure({ error: error })])
        )
      )
    )
  );

  createMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.createMetadata),
      mergeMap((action) =>
        this.service.postMetadata(action.metadata).pipe(
          map(() => MetadataActions.createMetadataSuccess({ metadata: action.metadata })),
          catchError((error) => [MetadataActions.createMetadataFailure({ error: error })])
        )
      )
    )
  );

  createMetadataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.createMetadataSuccess),
      map((action) => {
        return MetadataActions.loadMetadata();
      })
    )
  );

  addDatasetMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.addDatasetMetadata),
      mergeMap((action) =>
        this.dataSourceService.addDatasetMetadata(action.datasetId, action.metadataId, action.value).pipe(
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
          DataSourceActions.dataset.getDatasetById({ id: action.datasetId }),
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
        this.dataSourceService.deleteDatasetMetadata(action.datasetId, action.metadataId).pipe(
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
          DataSourceActions.dataset.getDatasetById({ id: action.datasetId }),
          MetadataActions.isEditable({ editable: false }),
          DataSourceActions.dataset.loadDataset()
        ];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private service: MetadataService,
    private dataSourceService: DataSourceService
  ) {}
}
