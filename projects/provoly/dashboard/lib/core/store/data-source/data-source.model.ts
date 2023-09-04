import { PryVisibility } from '../../components/share/share.model';
import { DatasetMetadata } from '../../model/admin-api.model';
import { Dataset } from '../../model/dataset.interface';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';

export type DataSource = NamedQuery | Dataset;

export interface NamedQuery extends DescriptionQuery {
  sourceType: 'namedQuery';
  id: string;
  request: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload;
  color?: string;
  favorite?: boolean;
  lastExecutionDate?: Date;
  owner?: boolean;
}

export interface DescriptionQuery {
  name: string;
  description?: string;
  visibility?: PryVisibility;
  metadata?: DatasetMetadata[];
}

export interface DatasetVersion {
  id: string;
  dataset: string;
  oClass: string;
  lastModified: string;
  available: boolean;
  version: number;
  state: string;
  withFile: boolean;
  metadata: any[];
  hasWarnings: boolean;
}
