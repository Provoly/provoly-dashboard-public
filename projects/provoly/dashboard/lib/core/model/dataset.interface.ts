export enum PryDatasetType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MODIFIABLE = 'MODIFIABLE'
}

export interface DatasetCount {
  id: string;
  count: number;
}

export enum GeoMetadata {
  NAMESPACE = '_geoNamespace',
  KEY = '_geoKey',
  OPACITY = '_geoOpacity'
}

export interface DatasetMessage {
  extractMessageCode: string;
  type: string;
  name: string;
  recordId: string;
  datasetVersionId: string;
  level: 'ERROR' | 'WARNING';
}

export interface DatasetPreview {
  level: 'ERROR' | 'WARNING';
  messages: DatasetMessage[];
  count: number;
}
