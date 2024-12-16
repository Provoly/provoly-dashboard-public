import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

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

const BBOX_ENHANCE_DISTANCE = 0.0001;
const wfsUrlBuilder = (wmsUrl: string, bbox: number[], geomPropName: string, params?: string[]) => {
  const enhancedBbox = [
    bbox[0] - BBOX_ENHANCE_DISTANCE,
    bbox[1] - BBOX_ENHANCE_DISTANCE,
    bbox[2] + BBOX_ENHANCE_DISTANCE,
    bbox[3] + BBOX_ENHANCE_DISTANCE
  ];
  const wfsFragments: { [key: string]: string | undefined } = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    outputFormat: 'application/json',
    typeNames: undefined,
    bbox: `${enhancedBbox.join(',')},EPSG:4326`,
    srsName: undefined,
    params: params ? `&${params.join('&')}` : ''
  };
  const base = wmsUrl.split('?')[0].replace('wms', 'wfs');
  const wmsUrlFragments = wmsUrl.split('&');
  wfsFragments['typeNames'] = wmsUrlFragments.find((param) => param.toUpperCase().includes('LAYERS'))?.split('=')[1];
  wfsFragments['srsName'] = wmsUrlFragments.find((param) => param.toUpperCase().includes('CRS'))?.split('=')[1];

  const cqlFilterFragment = wmsUrlFragments.find((param) => param.toUpperCase().includes('CQL_FILTER'));
  if (cqlFilterFragment) {
    const previousFragment = cqlFilterFragment.split('=')[1];
    // cql_filter and bbox are mutually exclusive so we need to replace bbox with a cql filter on the bbox
    wfsFragments['cql_filter'] =
      previousFragment + ` AND BBOX(${geomPropName}, ${enhancedBbox.join(',')}, 'EPSG:4326')`;
    wfsFragments['bbox'] = undefined;
  }

  return (
    base +
    '?' +
    Object.entries(wfsFragments)
      .map(([key, value]) => (value ? `${key}=${value}` : undefined))
      .filter((val) => !!val)
      .join('&')
  );
};
