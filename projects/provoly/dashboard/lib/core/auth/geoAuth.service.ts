import { Injectable, InjectionToken } from '@angular/core';

export abstract class PryGeoAuthService {
  abstract customLoader(tile: any, src: string): void;
}

export const PRY_GEOAUTH_TOKEN = new InjectionToken<PryGeoAuthService>('PRY_GEOAUTH_TOKEN');

@Injectable()
export class PryDefaultGeoAuthService extends PryGeoAuthService {
  constructor() {
    super();
  }

  override customLoader(tile: any, src: string): void {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.addEventListener('loadend', function (evt) {
      const data = this.response;
      if (data !== undefined) {
        tile.getImage().src = URL.createObjectURL(data);
      }
    });
    xhr.open('GET', src);
    // Exemple of how to pass authentification header
    // client.setRequestHeader('Authorization', 'Basic ' + window.btoa('user:pass'));
    xhr.send();
  }
}
