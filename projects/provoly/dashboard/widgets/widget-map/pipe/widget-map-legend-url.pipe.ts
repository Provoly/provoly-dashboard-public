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
        const styles = XMLUtils.findAll(matchingLayer.childNodes, 'Style');
        if (geoLayer.additionalParameters && geoLayer.additionalParameters['STYLES'] !== undefined) {
          for (let i = 0; i < styles.length; i++) {
            const style = styles[i];
            const styleName = XMLUtils.find(style.childNodes, 'Name')?.textContent ?? '--';
            if (styleName === geoLayer.additionalParameters['STYLES']) {
              return this.returnStyleForLayer(style);
            }
          }
        } else {
          return this.returnStyleForLayer(styles[0]);
        }
      }
    }
    return '';
  }

  returnStyleForLayer(style: ChildNode): string {
    const legendUrl = XMLUtils.find(style.childNodes, 'LegendURL');
    if (legendUrl) {
      const resource = XMLUtils.find(legendUrl.childNodes, 'OnlineResource');
      if (resource) {
        // @ts-ignore
        return decodeURIComponent(resource.getAttribute('xlink:href')) + '&LEGEND_OPTIONS=forceLabels:on';
      }
    }
    return '';
  }
}
