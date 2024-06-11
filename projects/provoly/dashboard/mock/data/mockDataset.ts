import {
  Condition,
  Dataset,
  DatasetVersion, FullTextSearchPayload,
  MonoClassSearchPayload,
  MultiClassSearchPayload, NamedQueryTypes,
  PryDatasetType
} from '@provoly/dashboard';
import { mockCategories } from '@provoly/dashboard/mock/data/mockCategories';

export const mockDatasets: Dataset[] = [
  {
    sourceType: 'dataset',
    id: 'AAAA-BBBB-CCCC',
    name: 'fake name 1',
    oClass: '123456789',
    type: PryDatasetType.OPEN,
    metadata: [],
    slug: 'AAAA-BBBB-CCCC-slug',
    categories: [...mockCategories]
  },
  {
    sourceType: 'dataset',
    id: 'CCCC-BBBB-AAAA',
    name: 'fake name 2',
    oClass: '987654321',
    type: PryDatasetType.CLOSED,
    metadata: [],
    slug: 'CCCC-BBBB-AAAA-slug',
    categories: []
  }
];

export const mockDatasetVersions: DatasetVersion[] = [
  {
    id: 'AAAA-BBBB-CCCC',
    oClass: '123456789',
    metadata: [],
    dataset: 'dataset-id',
    lastModified: '2022-10-05T14:48:00.000Z',
    available: true,
    version: 1,
    state: 'OK',
    withFile: false,
    hasWarnings: false
  },
  {
    id: 'CCCC-BBBB-AAAA',
    oClass: '123456789',
    metadata: [],
    dataset: 'dataset-id',
    lastModified: '2022-10-20T14:48:00.000Z',
    available: true,
    version: 2,
    state: 'OK',
    withFile: false,
    hasWarnings: false
  }
];

export const mockDatasetVersion = {
  id: 'test-id',
  dataset: 'test-ds-id',
  oClass: 'test-class',
  lastModified: '2023-01-20',
  available: true,
  version: 10,
  state: 'ERROR',
  withFile: false,
  metadata: [],
  hasWarnings: false
};

export const mockNamedQueries = [
  {
    name: 'test query 1',
    sourceType: 'namedQuery',
    id: 'nq-id-1',
    request: {
      fullSearch: {
        value: 'test'
      }
    }
  },
  {
    name: 'test query 2',
    sourceType: 'namedQuery',
    id: 'nq-id-2',
    request: {
      type: NamedQueryTypes.MONO_CLASS,
      oClass: 'class-id',
      condition: { type: 'condition', attribute: 'attr', value: 'value' },
      sort: {
        attribute: 'attr',
        direction: 'asc'
      }
    }
  }
]

export const mockClickEvent = {
  preventDefault: () => {},
  stopPropagation: () => {}
} as Event;
