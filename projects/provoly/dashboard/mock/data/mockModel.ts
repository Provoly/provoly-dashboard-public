import { Attribute, Class, Field, FieldType } from '@provoly/dashboard';

export const mockFields: Field[] = [
  {
    id: 'field1',
    name: 'field1',
    type: FieldType.STRING
  },
  {
    id: 'field2',
    name: 'field2',
    type: FieldType.STRING
  }
];

export const mockAttributes: Attribute[] = [
  {
    id: 'attr1',
    name: 'attr1',
    technicalName: 'attr1',
    field: mockFields[0],
    multiValued: false
  },
  {
    id: 'attr2',
    name: 'attr2',
    technicalName: 'attr2',
    field: mockFields[0],
    multiValued: false
  },
  {
    id: 'attr3',
    name: 'attr3',
    technicalName: 'attr3',
    field: mockFields[1],
    multiValued: false
  }
];

export const mockClasses: Class[] = [
  {
    id: 'class1',
    name: 'class1',
    attributes: [mockAttributes[0]]
  },
  {
    id: 'class2',
    name: 'class2',
    attributes: [mockAttributes[1]]
  },
  {
    id: 'class3',
    name: 'class3',
    attributes: [mockAttributes[2]]
  }
];
