import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapGeoServerLayerOptions, MapWMSLayerLayerOptions } from '@provoly/dashboard';
import { XMLUtils } from '@provoly/dashboard/widgets/widget-map';
import { map, Observable, of } from 'rxjs';

export type GetCapabilitiesResponse = { url: string; paramLayer: string; doc: Document };

@Injectable({
  providedIn: 'root'
})
export class WmsService {
  parser = new DOMParser();

  constructor(private httpClient: HttpClient) {}

  getCapabilities(
    wmsLayer: MapGeoServerLayerOptions | MapWMSLayerLayerOptions
  ): Observable<GetCapabilitiesResponse | null> {
    if (wmsLayer && wmsLayer.url) {
      const layerUrlWithQmark = wmsLayer.url.indexOf('?') === -1 ? wmsLayer.url + '?' : wmsLayer.url;
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
              console.error(`Cannot getCapabilities for ${wmsLayer.url}[${wmsLayer.paramLayer}]`);
              return null;
            } else {
              return { url: wmsLayer.url, paramLayer: wmsLayer.paramLayer, doc };
            }
          })
        );
    }
    return of(null);
  }

  static getMatchingLayer(paramLayer: string, doc: Document) {
    const WMSCapability = XMLUtils.find(doc.childNodes, 'WMS_Capabilities');
    if (WMSCapability) {
      const Capabilities = XMLUtils.find(WMSCapability.childNodes, 'Capability');
      if (Capabilities) {
        const Layer = XMLUtils.find(Capabilities.childNodes, 'Layer');
        if (Layer) {
          let matchingLayer = XMLUtils.findWith(Layer.childNodes, 'Name', paramLayer);
          const split = paramLayer.split(':');
          if (!matchingLayer && split.length >= 2) {
            // Try again, splitting on ":" in the name to ignore namespace if present
            matchingLayer = XMLUtils.findWith(Layer.childNodes, 'Name', split[split.length - 1]);
          }
          return matchingLayer;
        }
      }
    }
    return null;
  }
}
