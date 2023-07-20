// noinspection AngularMissingOrInvalidDeclarationInModule

import { Item } from '@provoly/dashboard';

export const mockItemWidget: Item[] = [
  {
    id: '1',
    oClass: 'oClass',
    attributes: {
      test: {
        type: 'VALUE',
        value: 2,
        visible: false
      }
    }
  },
  {
    id: '2',
    oClass: 'a',
    attributes: { test: { type: 'VALUE', value: 4, visible: true } }
  },
  {
    id: '3',
    oClass: 'b',
    attributes: { test2: { type: 'VALUE', value: 4, visible: true } }
  },
  {
    id: '4',
    oClass: 'c',
    attributes: { test2: { type: 'VALUE', value: 4, visible: true } }
  }
];
