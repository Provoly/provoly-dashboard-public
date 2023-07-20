// noinspection AngularMissingOrInvalidDeclarationInModule

import { VariableDefinition } from '@provoly/dashboard';

export const mockVariablesWidgetCharts: VariableDefinition[] = [
  { label: 'test-label', name: 'test-name', type: 'nominal' },
  { label: 'test-label-1', name: 'test-name-1', type: 'nominal' },
  { label: 'test-label-2', name: 'test-name-2', type: 'nominal' },
  { label: 'test-label-3', name: 'test-name-3', type: 'quantitative' },
  { label: 'test-label-three', name: 'test-name-three', type: 'quantitative' },
  { label: 'field-name-2', name: 'attributes.field-name-2.value', type: 'nominal' },
  { label: 'test-label_utc', name: 'test-name_utc', type: 'nominal' }
];
