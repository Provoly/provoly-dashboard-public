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
  GEOMETRYCOLLECTION = 'GeometryCollection',
  OCLASS = 'modèle de données',
  DATASET = 'test'
}

export interface Field {
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
