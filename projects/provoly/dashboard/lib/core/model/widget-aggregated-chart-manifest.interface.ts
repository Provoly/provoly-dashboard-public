export enum Operation {
  NONE = 'none',
  COUNT = 'count',
  SUM = 'sum',
  DISTINCT = 'cardinality',
  AVERAGE = 'avg',
  MEDIAN = 'median',
  Q1 = 'q1',
  Q3 = 'q3',
  MIN = 'min',
  MAX = 'max',
  EXTENT = 'extent'
}

export enum GraphType {
  AREA = 'area-default',
  AREA_WITH_LINES_AND_POINTS = 'area-with-lines-and-points',
  BAR = 'bar-default',
  CIRCULAR = 'arc-default',
  CURVE = 'line-default',
  CURVE_WITH_POINTS = 'line-with-points',
  DONUT = 'arc-donut',
  HISTOGRAM = 'bar-histogram',
  POINTS = 'point-default'
}

export type TimeInterval = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'quarter' | 'year';

export interface Sort {
  value: 'key' | 'value';
  direction: 'asc' | 'desc';
}

export interface ChartAggregatedWidgetOptions {
  abscissa: {
    label: string;
    attribute: string;
    keep0: boolean;
    limit?: number | null;
    interval?: number | TimeInterval;
  };
  ordinate: {
    operation: Operation;
    label: string;
    attribute?: string;
    keep0: boolean;
  };
  groupBy?: {
    attribute: string;
    color: string;
  };
  graph: {
    donutSize?: number;
    tooltip?: boolean;
    title?: string;
    type: GraphType;
    stacked?: boolean;
    legend?: boolean;
    sort?: Sort;
  };
  additionalSpec?: any;
  circleColorScheme?: string;
  baseColor?: string;
}
