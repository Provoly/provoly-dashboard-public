import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrySnackbarService } from '../components/snackbar/snackbar.service';
import { PryI18nService } from '../i18n/i18n.service';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';

export abstract class PryGeoAuthService {
  abstract customLoader(tile: any, src: string): void;
}

export const PRY_GEOAUTH_TOKEN = new InjectionToken<PryGeoAuthService>('PRY_GEOAUTH_TOKEN');

const CONTENT_TYPE = 'Content-Type';

const ERROR_CONTENT_REGEXP = new RegExp('<ServiceException [\\S\\s]*>([\\S\\s]*)<\\/ServiceException>', 'gm');

export const GEOSERVER_FAILURE_FN = {
  func: (
    action: {
      code: number;
      reason: string;
    },
    snackBarService: PrySnackbarService,
    i18nService: PryI18nService,
    store: Store
  ) => {
    switch (action.code) {
      default:
        console.error(`Geoserver error [${action.code}]: ${action.reason}`);
        snackBarService.open({
          type: 'error',
          message: i18nService.instant('@pry.geoAuth.failure', { reason: action.reason })
        });
        break;
      case -2:
        console.warn(`Strange geoserver return  [${action.code}]: ${action.reason}`);
        break;
    }
  }
};

@Injectable()
export class PryDefaultGeoAuthService extends PryGeoAuthService {
  constructor(
    private httpClient: HttpClient,
    private snack: PrySnackbarService,
    private i18nService: PryI18nService,
    private store: Store
  ) {
    super();
  }

  override customLoader(tile: any, src: string): void {
    this.httpClient
      .get(src, { observe: 'response', params: {}, responseType: 'blob' })
      .pipe(
        catchError((err) => {
          GEOSERVER_FAILURE_FN.func(
            {
              code: err.status,
              reason: err.statusText
            },
            this.snack,
            this.i18nService,
            this.store
          );
          return throwError(err);
        })
      )
      .subscribe((blob) => {
        if (blob.headers.has(CONTENT_TYPE) && (blob.headers.get(CONTENT_TYPE) ?? '').indexOf('text/xml') >= 0) {
          blob.body!.text().then((text) => {
            const match = text.match(ERROR_CONTENT_REGEXP);
            const reason = match![0].replace(/\r/g, '').replace(/\n/g, '').replace(/\s\s/g, ' ');
            if (reason.includes('401') && reason.includes('RemoteException')) {
              GEOSERVER_FAILURE_FN.func({ code: 401, reason }, this.snack, this.i18nService, this.store);
            } else if (!!reason) {
              GEOSERVER_FAILURE_FN.func({ code: -1, reason }, this.snack, this.i18nService, this.store);
            } else {
              GEOSERVER_FAILURE_FN.func({ code: -2, reason }, this.snack, this.i18nService, this.store);
            }
          });
        } else {
          tile.getImage().src = URL.createObjectURL(blob.body!);
        }
      });
  }
}
