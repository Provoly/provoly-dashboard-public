import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { MetadataActions } from './metadata.action';

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

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private store: Store<any>,
    private router: Router
  ) {}
}
