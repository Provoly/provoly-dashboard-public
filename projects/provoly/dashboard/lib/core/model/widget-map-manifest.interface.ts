import { BehaviorSubject } from 'rxjs';

export interface MapWidgetOptions {
  center?: number[];
  zoom?: {
    start: number;
    min: number;
    max: number;
  };
  style: string;
  layers?: MapWidgetLayerOptions[];
  fit?: boolean;
  attributions?: boolean;
  tooltipMode?: TooltipMode;
}

export type MapWidgetLayerOptions =
  | MapWidgetHeatMapLayerOptions
  | MapWidgetMarkerLayerOptions
  | MapWidgetBubbleLayerOptions
  | MapWidgetRelationLayerOptions
  | MapWMSLayerLayerOptions
  | MapFeatureLayerOptions
  | MapVectorTileLayerOptions
  | MapRasterTileLayerOptions
  | MapGeoServerLayerOptions
  | MapWMTSLayerLayerOptions
  | MapWidgetGeometryLayerOptions;

export interface BaseWidgetMapLayerOptions {
  type: string;
  attribution?: string;
  title?: string;
  minZoom?: number;
  maxZoom?: number;
  opacity?: number;
}

export interface MapWidgetHeatMapLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'heatmap';
  attribute: string;
  classes?: string[];
  intensityAttribute?: string;
  intensityAsc?: boolean;
  radius?: number;
}

export interface MapWidgetGeometryLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'point' | 'line' | 'polygon' | 'multi-line' | 'multi-polygon';
  attribute: string;
  classes?: string[];
}

export interface MapWidgetMarkerLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'marker';
  attribute: string;
  classes?: string[];
  clustered?: boolean;
  clusterDistance?: number;
}

export interface MapWidgetBubbleLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'bubble';
  attribute: string;
  intensityAttribute?: string;
  intensityAsc?: boolean;
  radiusFactor?: number;
  radius?: number;
  classes?: string[];
}

export interface MapWidgetRelationLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'relation';
}

export interface MapWMSLayerLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'wms';
  url: string;
  paramLayer: string;
  paramTiled: boolean;
  oClass: string;
}

export interface MapWMTSLayerLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'wmts';
  url: string;
  paramLayer: string;
  matrixSet: string;
  style: string;
}

export interface MapFeatureLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'featurelayer';
  url: string;
}

export interface MapVectorTileLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'vectortile';
  url: string;
}

export interface MapRasterTileLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'rastertile';
  url: string;
}

export interface MapGeoServerLayerOptions extends BaseWidgetMapLayerOptions {
  type: 'geoserver';
  key: string;
  paramLayer: string;
  paramTiled: boolean;
  url: string;
  oClass: string;
}

export enum TooltipMode {
  HOVER = 'hover',
  CLICK = 'click',
  NONE = 'none'
}

export const widgetMapConfig = {
  actions$: new BehaviorSubject<('click' | 'lasso' | 'rectangle' | 'zoom' | 'move' | 'export' | 'upload')[]>([
    'move',
    'click',
    'lasso',
    'rectangle',
    'zoom',
    'export',
    'upload'
  ])
};
