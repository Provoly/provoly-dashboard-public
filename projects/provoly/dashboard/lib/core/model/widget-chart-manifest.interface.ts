export type TimeUnit =
  | 'year'
  | 'quarter'
  | 'month'
  | 'week'
  | 'day'
  | 'date'
  | 'dayofyear'
  | 'hours'
  | 'minutes'
  | 'seconds'
  | 'milliseconds';

export interface ChartWidgetOptions {
  fill?: { signal: string } | boolean;
  scale?: { scheme: VegaColorType | string | { domain: Array<string>; range: Array<string> } };
  tooltip?: boolean;
  title: string;
  customTitle?: string;
  selectedVariables: VariableDefinition[];
  type: MarkType;
  subType: string;
  innerRadius?: number;
  aggregation?: Aggregation;
  radar?: {
    props?: string[];
    compare?: 'item' | 'value';
    keyProp?: string;
    valueProp?: string;
    categoryProp?: string;
  };
  packing?: {
    id?: string;
    tooltip?: string;
    parentId?: string;
    packField?: string;
  };
  series?: {
    groupBy?: string;
    scheme?: VegaColorType;
  };
  legend?: boolean;
  specToMerge: any;
  locale?: 'en' | 'fr';
}

export interface VariableDefinition {
  name: string;
  label: string;
  type: any; //import { StandardType } from 'vega-lite/build/src/type';
  origin0?: boolean;
  timeUnit?: TimeUnit;
  axisOptions?: { tickMinStep: number };
}

export enum VegaType {
  ORDINAL = 'ordinal',
  QUANTITATIVE = 'quantitative',
  TEMPORAL = 'temporal',
  NOMINAL = 'nominal'
}

export enum VegaColorType {
  PROVOLY = 'Provoly',
  ACCENT = 'accent',
  SET2 = 'set2',
  DARK2 = 'dark2',
  PASTEL2 = 'pastel2',
  SET1 = 'set1',
  PASTEL1 = 'pastel1',
  CATEGORY10 = 'category10',
  TABLEAU10 = 'tableau10',
  SET3 = 'set3',
  PAIRED = 'paired',
  TABLEAU20 = 'tableau20',
  CATEGORY20 = 'category20',
  CATEGORY20B = 'category20b',
  CATEGORY20C = 'category20c',
  KO_W_OK = 'KO/W/OK'
}

export enum MarkType {
  BAR = 'bar',
  LINE = 'line',
  POINT = 'point',
  AREA = 'area',
  ARC = 'arc',
  RADAR = 'radar',
  CIRCLE_PACK = 'circle_pack'
}

export enum MarkSubType {
  DEFAULT = 'default',
  HISTOGRAM = 'histogram',
  TIME_HISTOGRAM = 'timehistogram',
  GROUPED = 'grouped',
  AREASTACKED = 'areastacked',
  HISTOSTACKED = 'histostacked',
  WITH_POINTS = 'withPoints',
  MULTI = 'multi',
  WITH_LINES_AND_POINTS = 'withLinesAndPoints',
  PIE = 'pie',
  DONUT = 'donut'
}

export enum Aggregation {
  NONE = 'none',
  COUNT = 'count',
  SUM = 'sum',
  DISTINCT = 'distinct',
  AVERAGE = 'average',
  MEDIAN = 'median',
  Q1 = 'q1',
  Q3 = 'q3',
  MIN = 'min',
  MAX = 'max'
}

export interface Size {
  width: number;
  height: number;
}

export interface ChartSubTypeDefinition {
  bar: MarkSubType[];
  line: MarkSubType[];
  point: MarkSubType[];
  area: MarkSubType[];
  arc: MarkSubType[];
  radar: MarkSubType[];
  circle_pack: MarkSubType[];
}

export interface EncodingDefinition {
  x?: EncodingChannel;
  y?: EncodingChannel;
  color?: EncodingChannel;
  theta?: EncodingChannel;
}

export interface EncodingChannel {
  field?: string;
  type?: any; // import { StandardType } from 'vega-lite/build/src/type';
  title?: string;
  bin?: boolean;
  aggregate?: any; //import { AggregatedFieldDef } from 'vega-lite/build/src/transform';
  timeUnit?: any; // import { TimeUnit } from 'vega';
  scale?: ScaleDefinition;
  axis?: any;
}

export interface ScaleDefinition {
  zero?: boolean;
  type?: any; //import { ScaleType } from 'vega-lite/build/src/scale';
}

export interface AutoSize {
  type: string;
  contains: string;
}

export interface ChartOption {
  type: MarkType[];
  subType: Partial<ChartSubTypeDefinition>;
  aggregation: Aggregation[];
  color: VegaColorType[];
}
