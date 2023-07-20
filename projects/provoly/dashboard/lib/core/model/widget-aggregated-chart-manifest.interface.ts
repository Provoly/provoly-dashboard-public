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
  MAX = 'max'
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

export interface AtLimit {
  at: number;
  others: boolean;
  order: 'asc' | 'desc';
  isTimeLimit: false;
}

export interface TimeLimit {
  interval: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'quarter' | 'year';
  isTimeLimit: true;
}

export interface ChartAggregatedWidgetOptions {
  abscissa: {
    label: string;
    attribute: string;
    keep0: boolean;
    limit?: AtLimit | TimeLimit;
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
  };
  additionalSpec?: any;
}
