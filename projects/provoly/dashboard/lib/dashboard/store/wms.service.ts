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

  getWfsFeatures(wmsUrl: string, bbox: number[], geomPropName: string): Observable<{ features: any[] }> {
    const url = wfsUrlBuilder(wmsUrl, bbox, geomPropName);
    return this.httpClient.get(url).pipe(map((json: any) => json));
  }
}

const wfsUrlBuilder = (wmsUrl: string, bbox: number[], geomPropName: string, params?: string[]) => {
  const isBboxPoint = bbox[0] === bbox[2] && bbox[1] === bbox[3];
  const wfsFragments: { [key: string]: string | undefined } = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
    typeNames: undefined,
    cql_filter: isBboxPoint
      ? `EQUALS(${geomPropName}, POINT(${bbox[0]} ${bbox[1]}))`
      : `BBOX(${geomPropName},${bbox.join(',')})`,
    srsName: undefined,
    params: params ? `&${params.join('&')}` : ''
  };
  const base = wmsUrl.split('?')[0].replace('wms', 'wfs');
  const wmsUrlFragments = wmsUrl.split('&');
  wfsFragments['typeNames'] = wmsUrlFragments.find((param) => param.includes('LAYERS'))?.split('=')[1];
  wfsFragments['srsName'] = wmsUrlFragments.find((param) => param.toUpperCase().includes('CRS'))?.split('=')[1];
  wfsFragments['cql_filter'] += wmsUrlFragments.find((param) => param.toUpperCase().includes('CQL_FILTER'))
    ? ' AND ' + wmsUrlFragments.find((param) => param.toUpperCase().includes('CQL_FILTER'))?.split('=')[1]
    : '';

  return (
    base +
    '?' +
    Object.entries(wfsFragments)
      .map(([key, value]) => (value ? `${key}=${value}` : undefined))
      .filter((val) => !!val)
      .join('&')
  );
};
