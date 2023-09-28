import { Pipe, PipeTransform } from '@angular/core';
import { GetCapabilitiesResponse, MapGeoServerLayerOptions, MapWMSLayerLayerOptions } from '@provoly/dashboard';
import { XMLUtils } from '../utils/xml-utils.class';

@Pipe({
  name: 'legendUrl'
})
export class WidgetMapLegendUrlPipe implements PipeTransform {
  constructor() {}

  parser = new DOMParser();

  transform(
    geoLayer: MapGeoServerLayerOptions | MapWMSLayerLayerOptions,
    ...args: [{ capabilities: { [p: string]: GetCapabilitiesResponse | null } | undefined | null }]
  ): string {
    const capability = (args[0].capabilities ?? {})[geoLayer.url];
    if (capability) {
      const matchingLayer = XMLUtils.getMatchingLayer(geoLayer.paramLayer, capability.doc);
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
    return '';
  }
}
