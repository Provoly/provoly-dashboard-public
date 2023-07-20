import { Pipe, PipeTransform } from '@angular/core';
import { MapGeoServerLayerOptions, MapWMSLayerLayerOptions } from '@provoly/dashboard';

@Pipe({
  name: 'legendUrl'
})
export class WidgetMapLegendUrlPipe implements PipeTransform {
  transform(geoLayer: MapGeoServerLayerOptions | MapWMSLayerLayerOptions): string {
    if (geoLayer && geoLayer.url) {
      const layerUrlWithQmark = geoLayer.url.indexOf('?') === -1 ? geoLayer.url + '?' : geoLayer.url;
      const layerUrlWithService =
        layerUrlWithQmark.indexOf('&SERVICE=') === -1 ? layerUrlWithQmark + '&SERVICE=WMS' : layerUrlWithQmark;
      const layerUrlWithVersion =
        layerUrlWithService.indexOf('&VERSION=') === -1 ? layerUrlWithService + '&VERSION=1.3.0' : layerUrlWithService;

      return `${layerUrlWithVersion}&REQUEST=GetLegendGraphic&format=image%2Fpng&LAYER=${geoLayer.paramLayer}&LEGEND_OPTIONS=fontName:Ubuntu`;
    }
    return '';
  }
}
