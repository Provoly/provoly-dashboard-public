import { DatasetVersion } from '@provoly/dashboard';

export const mockVersionData = {
  producer: 'producer',
  additionalInformation: 'info',
  productionDate: new Date().toISOString()
} as Partial<DatasetVersion>;

export const mockImportData = {
  file: new File([''], 'fakefilename.csv', { type: 'text/csv' }),
  dataset: 'fakedatasetid',
  fileType: 'csv',
  datasetVersionInformation: mockVersionData
};
