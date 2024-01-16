import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrySnackbarService } from '../components/snackbar/snackbar.service';
import { PryI18nService } from '../i18n/i18n.service';

export abstract class PryGeoAuthService {
  abstract customLoader(tile: any, src: string): void;
}

export const PRY_GEOAUTH_TOKEN = new InjectionToken<PryGeoAuthService>('PRY_GEOAUTH_TOKEN');

const CONTENT_TYPE = 'Content-Type';

const ERROR_CONTENT_REGEXP = new RegExp('<ServiceException [\\S\\s]*>([\\S\\s]*)<\\/ServiceException>', 'gm');

@Injectable()
export class PryDefaultGeoAuthService extends PryGeoAuthService {
  constructor(private httpClient: HttpClient, private snack: PrySnackbarService, private i18nService: PryI18nService) {
    super();
  }

  override customLoader(tile: any, src: string): void {
    this.httpClient.get(src, { observe: 'response', params: {}, responseType: 'blob' }).subscribe((blob) => {
      if (blob.headers.has(CONTENT_TYPE) && (blob.headers.get(CONTENT_TYPE) ?? '').indexOf('text/xml') >= 0) {
        blob.body!.text().then((text) => {
          const match = text.match(ERROR_CONTENT_REGEXP);
          const reason = match![0].replace(/\r/g, '').replace(/\n/g, '').replace(/\s\s/g, ' ');
          if (!!reason) {
            console.error(`Geoserver error: ${reason}`);
            this.snack.open({
              type: 'error',
              message: this.i18nService.instant('@pry.geoAuth.failure', { reason })
            });
          } else {
            console.warn(`Strange geoserver return ${text}`);
          }
        });
      } else {
        tile.getImage().src = URL.createObjectURL(blob.body!);
      }
    });
  }
}
