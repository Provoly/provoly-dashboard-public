import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type GetCapabilitiesResponse = { url: string; doc?: Document };

@Injectable({
  providedIn: 'root'
})
export class WmsService {
  parser = new DOMParser();

  constructor(private httpClient: HttpClient) {}

  getCapabilities(url: string): Observable<GetCapabilitiesResponse | null> {
    if (url) {
      const layerUrlWithQmark = url.indexOf('?') === -1 ? url + '?' : url;
      const layerUrlWithService =
        layerUrlWithQmark.indexOf('&SERVICE=') === -1 ? layerUrlWithQmark + '&SERVICE=WMS' : layerUrlWithQmark;
      const layerUrlWithVersion =
        layerUrlWithService.indexOf('&VERSION=') === -1 ? layerUrlWithService + '&VERSION=1.3.0' : layerUrlWithService;

      return this.httpClient
        .get(`${layerUrlWithVersion}&REQUEST=GetCapabilities`, {
          headers: new HttpHeaders({
            Accept: 'text/html, application/xhtml+xml, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
          }),
          responseType: 'text'
        })
        .pipe(
          map((response) => {
            const doc = this.parser.parseFromString(response, 'application/xml');
            const errorNode = doc.querySelector('parsererror');
            if (errorNode) {
              console.error(`Cannot getCapabilities for ${url}`);
              return null;
            } else {
              return { url, doc };
            }
          }),
          catchError(() => {
            console.error(`Cannot getCapabilities for ${url}`);
            return of(null);
          })
        );
    }
    return of(null);
  }

  getWmsFeatures(url: string): Observable<{ features: any[] }> {
    return this.httpClient.get(url).pipe(map((json: any) => json));
  }
}
