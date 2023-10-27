import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export abstract class PryGeoAuthService {
  abstract customLoader(tile: any, src: string): void;
}

export const PRY_GEOAUTH_TOKEN = new InjectionToken<PryGeoAuthService>('PRY_GEOAUTH_TOKEN');

@Injectable()
export class PryDefaultGeoAuthService extends PryGeoAuthService {
  constructor(private httpClient: HttpClient) {
    super();
  }

  override customLoader(tile: any, src: string): void {
    this.httpClient.get(src, { observe: 'response', params: {}, responseType: 'blob' }).subscribe((blob) => {
      tile.getImage().src = URL.createObjectURL(blob.body!);
    });
  }
}
