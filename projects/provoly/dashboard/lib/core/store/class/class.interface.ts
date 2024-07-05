import { Field } from '../field/field.interface';

export interface Class {
  id: string;
  name: string;
  icon?: string;
  attributes: Attribute[];
  storage?: string;
}

export interface Attribute {
  id: string;
  name: string;
  technicalName: string;
  field: Field;
  category?: string;
  multiValued: boolean;
}

export interface Associations {
  id: string;
  associations: [
    {
      id: string;
      name: string;
      type: string;
    }
  ];
  usedElsewhere: boolean;
}
