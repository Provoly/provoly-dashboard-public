import { PryVisibility } from '../components/share/share.model';
import { MetadataValue } from './admin-api.model';
import { Filter } from './filter.interface';
import { ChartAggregatedWidgetOptions } from './widget-aggregated-chart-manifest.interface';
import { ChartWidgetOptions } from './widget-chart-manifest.interface';
import { DetailWidgetOptions } from './widget-detail-manifest.interface';
import { GraphWidgetOptions } from './widget-graph-manifest.interface';
import { IframeWidgetOptions } from './widget-iframe-manifest.interface';
import { ImageWidgetOptions } from './widget-image-manifest.interface';
import { MapWidgetOptions } from './widget-map-manifest.interface';
import { TableWidgetOptions } from './widget-table-manifest.interface';
import { TemplateWidgetOptions } from './widget-template-manifest.interface';
import { TileWidgetOptions } from './widget-tile-manifest.interface';
import { VegaWidgetOptions } from './widget-vega-manifest.interface';

export interface ManifestDescription {
  id: string;
  name: string;
  description: string;
  manifestUrl: string;
  image: string;
  cover: boolean;
  creationDate: string;
  modificationDate: string;
  visibility: PryVisibility;
  owner: boolean;
  datasource: string[];
  metadata: MetadataValue[];
}

export interface WidgetLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GridLayout {
  columns?: number;
  gap?: number;
  rows?: number;
  layout?: DashboardGridLayout;
}

export enum DashboardGridLayout {
  FULL = '1',
  THIRD_VERTICAL = '1/3v',
  THIRD_HORIZONTAL = '1/3h',
  HALF_VERTICAL = '1/2v',
  HALF_HORIZONTAL = '1/2h',
  QUARTER = '1/4',
  MANUAL = '0'
}

export interface DashboardManifest {
  route?: string;
  grid?: GridLayout;
  widgets: WidgetManifest[];
}

export interface Payload {
  filters: any[];
}

export interface Request {
  url: string;
  method: string;
  payload: Payload;
}

export interface GlobalManifest {
  windows: DashboardManifest[];
  refreshRates?: { [key: string]: number };
  locked?: boolean;
  filters?: Filter[];
}

export interface WidgetManifest {
  title?: string;
  type: string;
  layout: WidgetLayout;
  options?: WidgetOptions;
  datasource?: string | string[];
  header?: boolean | { [key: string]: boolean };
  locked?: boolean;
  cover?: boolean;
  contextMenu?: boolean;
}

export interface CustomWidgetOptions {
  [opt: string]: any;
}

export type WidgetOptions =
  | MapWidgetOptions
  | ImageWidgetOptions
  | TableWidgetOptions
  | DetailWidgetOptions
  | ChartWidgetOptions
  | ChartAggregatedWidgetOptions
  | IframeWidgetOptions
  | GraphWidgetOptions
  | TemplateWidgetOptions
  | TileWidgetOptions
  | VegaWidgetOptions
  | CustomWidgetOptions;
