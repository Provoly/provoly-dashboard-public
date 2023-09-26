import { Attribute } from '../store/class/class.interface';
import { FieldType } from '../store/field/field.interface';

export interface Predicate {
  id: string;
  name: string;
  value: string;
}

export interface IMetadata {
  id: string;
  name: string;
  type: VARIABLE_TYPE | METADATA_TYPE;
  description?: string;
  allowedValues?: Array<string>;
}

export interface Environment {
  name: string;
  type: VARIABLE_TYPE;
  value: any;
}

/**
 * Based on types present in pry-common
 */
export enum VARIABLE_TYPE {
  INTEGER = 'INTEGER',
  STRING = 'STRING',
  DOUBLE = 'DOUBLE',
  DATE = 'DATE',
  UUID = 'UUID'
}

export enum METADATA_TYPE {
  LIST = 'LIST'
}

export interface EnvOption {
  type: 'number' | 'string' | 'date';
  varType: VARIABLE_TYPE;
  translation: string;
}

export interface MetaOption {
  type: 'number' | 'string' | 'date' | 'string[]';
  varType: VARIABLE_TYPE | METADATA_TYPE;
  translation: string;
}

export const ENV_OPTIONS: EnvOption[] = [
  { type: 'number', varType: VARIABLE_TYPE.INTEGER, translation: '@pry.admin.varType.int' },
  { type: 'number', varType: VARIABLE_TYPE.DOUBLE, translation: '@pry.admin.varType.double' },
  { type: 'string', varType: VARIABLE_TYPE.STRING, translation: '@pry.admin.varType.string' },
  { type: 'string', varType: VARIABLE_TYPE.UUID, translation: '@pry.admin.varType.uuid' },
  { type: 'date', varType: VARIABLE_TYPE.DATE, translation: '@pry.admin.varType.date' }
];

export const META_OPTIONS: MetaOption[] = [
  ...ENV_OPTIONS,
  { type: 'string[]', varType: METADATA_TYPE.LIST, translation: '@pry.admin.varType.list' }
];

export const FIELD_UUID = '8b4907be-6159-486a-8502-c5e2139bbc27';
export const DEFAULT_CATEGORY_UUID = 'cf666d66-838f-4d92-a4d2-a315df21fac9';

export interface AttributeExtended {
  id: string;
  name: string;
  field: string;
  fieldName: string;
  category?: string;
  categoryName?: string;
  multiValued: boolean;
}

export interface FieldOption {
  varType: FieldType;
  translation: string;
  description: string;
}

export const FIELD_OPTIONS: FieldOption[] = [
  {
    varType: FieldType.INTEGER,
    translation: '@pry.admin.fields.fieldType.int',
    description: '@pry.admin.fields.fieldType.information.int'
  },
  {
    varType: FieldType.LONG,
    translation: '@pry.admin.fields.fieldType.long',
    description: '@pry.admin.fields.fieldType.information.long'
  },
  {
    varType: FieldType.DECIMAL,
    translation: '@pry.admin.fields.fieldType.decimal',
    description: '@pry.admin.fields.fieldType.information.decimal'
  },
  {
    varType: FieldType.STRING,
    translation: '@pry.admin.fields.fieldType.string',
    description: '@pry.admin.fields.fieldType.information.string'
  },
  {
    varType: FieldType.KEYWORD,
    translation: '@pry.admin.fields.fieldType.keyword',
    description: '@pry.admin.fields.fieldType.information.keyword'
  },
  {
    varType: FieldType.INSTANT,
    translation: '@pry.admin.fields.fieldType.instant',
    description: '@pry.admin.fields.fieldType.information.instant'
  },
  {
    varType: FieldType.RAW,
    translation: '@pry.admin.fields.fieldType.raw',
    description: '@pry.admin.fields.fieldType.information.raw'
  },
  {
    varType: FieldType.POINT,
    translation: '@pry.admin.fields.fieldType.point',
    description: '@pry.admin.fields.fieldType.information.point'
  },
  {
    varType: FieldType.MULTIPOINT,
    translation: '@pry.admin.fields.fieldType.multipoint',
    description: '@pry.admin.fields.fieldType.information.multipoint'
  },
  {
    varType: FieldType.LINE,
    translation: '@pry.admin.fields.fieldType.line',
    description: '@pry.admin.fields.fieldType.information.line'
  },
  {
    varType: FieldType.MULTILINE,
    translation: '@pry.admin.fields.fieldType.multiline',
    description: '@pry.admin.fields.fieldType.information.multiline'
  },
  {
    varType: FieldType.POLYGON,
    translation: '@pry.admin.fields.fieldType.polygon',
    description: '@pry.admin.fields.fieldType.information.polygon'
  },
  {
    varType: FieldType.MULTIPOLYGON,
    translation: '@pry.admin.fields.fieldType.multipolygon',
    description: '@pry.admin.fields.fieldType.information.multipolygon'
  }
];

export interface MetadataUser {
  userProfile: IMetadata;
  value: string;
}

export interface MetadataValue {
  metadataDef: IMetadata;
  value: string;
}

export interface UserInfo {
  id: string;
  claim: string;
  name: string;
  familyName: string;
  email: string;
  roles: string[];
}

export interface Link {
  id: string;
  relationType: string;
  attributeSource: string;
  attributeDestination: string;
}

export interface LinkDetails {
  id: string;
  relationType: any;
  attributeSource: Attribute;
  attributeDestination: Attribute;
}

export interface LinkExtended extends Link {
  id: string;
  relationType: string;
  classSource: string;
  attributeSource: string;
  classDestination: string;
  attributeDestination: string;
}

export interface MetadataRules {
  name: string;
}

export interface MetadataRulesCreate {
  id: string;
  name: string;
  userProfile: string;
  metadata: string;
}

export interface MetadataRules {
  id: string;
  name: string;
  userProfile: IMetadata;
  metadata: IMetadata;
}
