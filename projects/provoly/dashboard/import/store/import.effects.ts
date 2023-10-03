import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PryI18nService, PrySnackbarService } from '@provoly/dashboard';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ImportActions } from './import.actions';
import { ImportService } from './import.service';

@Injectable()
export class ImportEffects {
  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImportActions.upload),
      mergeMap((action) =>
        this.service.upload(action.file, action.dataset, action.fileType, action.normalizeGeo).pipe(
          map((uploadedDataset) => {
            return ImportActions.uploadSuccess({ uploadedDataset: uploadedDataset });
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 400 || error.status === 500) {
              return [ImportActions.uploadFailure({ errors: error.error.itemErrors })];
            } else if (error.status === 409) {
              this.snackbar.open({
                type: 'error',
                message: this.translateService.instant('@pry.import.errorCode.' + error.status)
              });
              return [ImportActions.uploadFailure({ errors: error.error.itemErrors })];
            }
            this.snackbar.open({
              type: 'error',
              message: this.translateService.instant('@pry.import.error', { msg: error.error.message })
            });
            throw error;
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private service: ImportService,
    private snackbar: PrySnackbarService,
    private translateService: PryI18nService
  ) {}
}
