export enum FieldType {
  STRING = 'string',
  KEYWORD = 'keyword',
  INTEGER = 'integer',
  DECIMAL = 'decimal',
  INSTANT = 'instant',
  LONG = 'long',
  RAW = 'raw',
  POINT = 'Point',
  MULTIPOINT = 'MultiPoint',
  LINE = 'LineString',
  MULTILINE = 'MultiLineString',
  POLYGON = 'Polygon',
  MULTIPOLYGON = 'MultiPolygon',
  GEOMETRYCOLLECTION = 'GeometryCollection'
}

export interface FormatOptions {
  format?: string;
  decimalPrecision?: number;
  unit?: string;
  localeFormat?: boolean;
}

export interface Field extends FormatOptions {
  id: string;
  name: string;
  type: FieldType;
  crs?: string;
}

export const GeometricFieldTypes = [
  FieldType.POINT,
  FieldType.MULTIPOINT,
  FieldType.LINE,
  FieldType.MULTILINE,
  FieldType.POLYGON,
  FieldType.MULTIPOLYGON,
  FieldType.GEOMETRYCOLLECTION
] as string[];

export const NumericFieldTypes = [FieldType.INTEGER, FieldType.DECIMAL, FieldType.INSTANT, FieldType.LONG] as string[];
export const TextFieldTypes = [FieldType.STRING, FieldType.KEYWORD] as string[];
