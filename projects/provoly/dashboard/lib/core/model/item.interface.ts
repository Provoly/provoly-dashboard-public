import { FieldType } from '../store/field/field.interface';

export interface Item {
  id: string;
  oClass: string;
  metadata?: {
    [key: string]: MetadataType;
  };
  attributes: {
    [key: string]: AttributeSimpleValue | AttributeMultipleValue;
  };
}

export const baseItemProperties = ['id', 'oClass', 'metadata'];

export interface AttributeMultipleValue {
  type: 'MULTI';
  values: AttributeSimpleValue[];
}

export interface AttributeSimpleValue {
  type: 'VALUE';
  value: ValueType;
  metadata?: {
    [key: string]: MetadataType;
  };
  visible: boolean;
}

export type ValueType = string | number | PointValue | MultipointValue | MultiMultipointValue;

export type PointValue = {
  type: FieldType.POINT;
  coordinates: [number, number];
};
export type MultipointValue = {
  type: FieldType.MULTIPOINT | FieldType.LINE | FieldType.POLYGON;
  coordinates: [number, number][];
};
export type MultiMultipointValue = {
  type: FieldType.MULTILINE | FieldType.MULTIPOLYGON | FieldType.GEOMETRYCOLLECTION;
  coordinates: [number, number][][];
};

export type MetadataType = string | number;
