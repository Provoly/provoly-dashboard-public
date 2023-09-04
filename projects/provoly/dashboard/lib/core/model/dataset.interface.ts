import { DescriptionQuery } from '../store/data-source/data-source.model';
import { DatasetMetadata } from './admin-api.model';

export enum PryDatasetType {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  MODIFIABLE = 'MODIFIABLE'
}

export interface Dataset extends DescriptionQuery {
  sourceType: 'dataset';
  id: string;
  name: string;
  oClass: string;
  type: PryDatasetType;
  metadata: DatasetMetadata[];
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
  extractErrorCode: string;
  type: string;
  name: string;
  recordID: string;
  datasetVersionId: string;
  level: 'ERROR' | 'WARNING';
}

export interface DatasetPreview {
  level: 'ERROR' | 'WARNING';
  messages: DatasetMessage[];
  count: number;
}
