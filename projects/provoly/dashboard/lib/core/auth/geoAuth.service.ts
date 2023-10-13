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
    const client = new XMLHttpRequest();
    client.open('GET', src);
    // Exemple of how to pass authentification header
    // client.setRequestHeader('Authorization', 'Basic ' + window.btoa('user:pass'));
    client.onload = () => {
      tile.getImage().src = src;
    };
    client.send();
  }
}
