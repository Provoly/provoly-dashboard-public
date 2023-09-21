import { Pipe, PipeTransform } from '@angular/core';
import { MapGeoServerLayerOptions, MapWMSLayerLayerOptions } from '@provoly/dashboard';
import { GetCapabilitiesResponse, WmsService } from '../component/wms.service';
import { XMLUtils } from '../utils/xml-utils.class';

@Pipe({
  name: 'legendUrl'
})
export class WidgetMapLegendUrlPipe implements PipeTransform {
  constructor() {}

  parser = new DOMParser();

  transform(
    geoLayer: MapGeoServerLayerOptions | MapWMSLayerLayerOptions,
    ...args: [{ capabilities: (GetCapabilitiesResponse | null)[] | null }]
  ): string {
    const capability = args[0].capabilities?.find((capa) => capa?.paramLayer === geoLayer.paramLayer);
    if (capability) {
      const matchingLayer = WmsService.getMatchingLayer(geoLayer.paramLayer, capability.doc);
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
