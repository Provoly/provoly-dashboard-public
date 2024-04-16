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
