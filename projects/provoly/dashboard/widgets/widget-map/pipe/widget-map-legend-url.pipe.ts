import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { MapGeoServerLayerOptions, MapWMSLayerLayerOptions } from '@provoly/dashboard';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { XMLUtils } from '../utils/xml-utils.class';

@Pipe({
  name: 'legendUrl'
})
export class WidgetMapLegendUrlPipe implements PipeTransform {
  constructor(private httpClient: HttpClient) {}

  parser = new DOMParser();

  transform(geoLayer: MapGeoServerLayerOptions | MapWMSLayerLayerOptions): Observable<string> {
    if (geoLayer && geoLayer.url) {
      const layerUrlWithQmark = geoLayer.url.indexOf('?') === -1 ? geoLayer.url + '?' : geoLayer.url;
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
              return '';
            } else {
              const WMSCapability = XMLUtils.find(doc.childNodes, 'WMS_Capabilities');
              if (WMSCapability) {
                const Capabilities = XMLUtils.find(WMSCapability.childNodes, 'Capability');
                if (Capabilities) {
                  const Layer = XMLUtils.find(Capabilities.childNodes, 'Layer');
                  if (Layer) {
                    let matchingLayer = XMLUtils.findWith(Layer.childNodes, 'Name', geoLayer.paramLayer);
                    const split = geoLayer.paramLayer.split(':');
                    if (!matchingLayer && split.length >= 2) {
                      // Try again, splitting on ":" in the name to ignore namespace if present
                      matchingLayer = XMLUtils.findWith(Layer.childNodes, 'Name', split[split.length - 1]);
                    }
                    if (matchingLayer) {
                      const matchingStyle = XMLUtils.find(matchingLayer.childNodes, 'Style');
                      if (matchingStyle) {
                        const legendUrl = XMLUtils.find(matchingStyle.childNodes, 'LegendURL');
                        if (legendUrl) {
                          const resource = XMLUtils.find(legendUrl.childNodes, 'OnlineResource');
                          if (resource) {
                            // @ts-ignore
                            return resource.getAttribute('xlink:href');
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            return '';
          }),
          catchError((err) => {
            console.error(err);
            return throwError(err);
          })
        );
    }
    return of('');
  }
}
