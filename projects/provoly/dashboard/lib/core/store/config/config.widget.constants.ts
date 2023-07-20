import {
  Aggregation,
  ChartSubTypeDefinition,
  MarkSubType,
  MarkType,
  VegaColorType
} from '../../model/widget-chart-manifest.interface';

export const defaultColors = ['#800000', '#FF6347', '#FF8C00', '#FFFF00', '#7CFC00', '#008000', '#00FFFF', '#4169E1'];

export const markTypesDefault: MarkType[] = [
  MarkType.ARC,
  MarkType.BAR,
  MarkType.AREA,
  MarkType.POINT,
  MarkType.LINE,
  MarkType.RADAR,
  MarkType.CIRCLE_PACK
];
export const subTypesDefault: ChartSubTypeDefinition = {
  bar: [MarkSubType.DEFAULT, MarkSubType.HISTOGRAM, MarkSubType.TIME_HISTOGRAM, MarkSubType.HISTOSTACKED],
  line: [MarkSubType.DEFAULT, MarkSubType.WITH_POINTS],
  point: [MarkSubType.DEFAULT],
  area: [MarkSubType.DEFAULT, MarkSubType.WITH_LINES_AND_POINTS, MarkSubType.AREASTACKED],
  arc: [MarkSubType.DEFAULT, MarkSubType.DONUT],
  radar: [MarkSubType.DEFAULT],
  circle_pack: [MarkSubType.DEFAULT]
};

export const vegaColorSchemesDefault = [
  VegaColorType.ACCENT,
  VegaColorType.SET2,
  VegaColorType.DARK2,
  VegaColorType.PASTEL2,
  VegaColorType.SET1,
  VegaColorType.PASTEL1,
  VegaColorType.CATEGORY10,
  VegaColorType.TABLEAU10,
  VegaColorType.SET3,
  VegaColorType.PAIRED,
  VegaColorType.TABLEAU20,
  VegaColorType.CATEGORY20,
  VegaColorType.CATEGORY20B,
  VegaColorType.CATEGORY20C
];

export const aggregationDefault = [
  Aggregation.NONE,
  Aggregation.COUNT,
  Aggregation.SUM,
  Aggregation.DISTINCT,
  Aggregation.AVERAGE,
  Aggregation.MEDIAN,
  Aggregation.Q1,
  Aggregation.Q3,
  Aggregation.MIN,
  Aggregation.MAX
];

export const ChartOptionDefault = {
  type: markTypesDefault,
  subType: subTypesDefault,
  aggregation: aggregationDefault,
  color: vegaColorSchemesDefault
};
