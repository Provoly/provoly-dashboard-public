import { Dataset, DatasetVersion, PryDatasetType } from '@provoly/dashboard';

export const mockDatasets: Dataset[] = [
  {
    sourceType: 'dataset',
    id: 'AAAA-BBBB-CCCC',
    name: 'fake name 1',
    oClass: '123456789',
    type: PryDatasetType.OPEN,
    metadata: [],
    slug: 'AAAA-BBBB-CCCC-slug'
  },
  {
    sourceType: 'dataset',
    id: 'CCCC-BBBB-AAAA',
    name: 'fake name 2',
    oClass: '987654321',
    type: PryDatasetType.CLOSED,
    metadata: [],
    slug: 'CCCC-BBBB-AAAA-slug'
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

export const mockClickEvent = {
  preventDefault: () => {},
  stopPropagation: () => {}
} as Event;
