// File with all Interface relative to the search model Api

import { NamedQueryTypes } from '../store/data-source/named-query-types.model';

export type ConditionType = 'AND' | 'OR' | 'ATTRIBUTE';
export type ValueDataType = string | number;
export type OperatorType =
  | 'EQUALS'
  | 'CONTAINS'
  | 'START_WITH'
  | 'END_WITH'
  | 'GREATER_THAN'
  | 'LOWER_THAN'
  | 'INSIDE'
  | 'OUTSIDE';

export interface Condition {
  type: ConditionType;
  attribute?: string;
  value?: ValueDataType;
  upperValue?: ValueDataType;
  operator?: OperatorType;
  composed?: Array<Condition>;
}

export interface NormalizedCondition {
  id: string;
  type: ConditionType;
  parentId: string;
  attribute?: string;
  value?: ValueDataType;
  upperValue?: ValueDataType;
  operator?: OperatorType;
  composed?: string[];
  pattern?: string;
  isDate?: boolean;
}

export interface MonoClassConditions {
  masterId: string | null;
  parentId?: string;
  ids: string[];
  entities: {
    [key: string]: NormalizedCondition;
  };
}

export interface MonoClassSearchPayload {
  type: NamedQueryTypes.MONO_CLASS;
  oClass: string;
  icon?: string;
  condition: Condition;
  sort: {
    attribute: string;
    direction: string;
  };
}

export interface OperatorOption {
  type: 'number' | 'string' | 'date';
  operator: OperatorType;
  translation: string;
  twoValues: boolean;
}

export const OPERATOR_OPTIONS: OperatorOption[] = [
  { type: 'string', operator: 'CONTAINS', translation: '@pry.search.operator.contains', twoValues: false },
  { type: 'string', operator: 'START_WITH', translation: '@pry.search.operator.startWith', twoValues: false },
  { type: 'string', operator: 'END_WITH', translation: '@pry.search.operator.endWith', twoValues: false },
  { type: 'string', operator: 'EQUALS', translation: '@pry.search.operator.equalsString', twoValues: false },
  { type: 'number', operator: 'EQUALS', translation: '@pry.search.operator.equalsNumber', twoValues: false },
  { type: 'number', operator: 'GREATER_THAN', translation: '@pry.search.operator.greaterThanNumber', twoValues: false },
  { type: 'number', operator: 'LOWER_THAN', translation: '@pry.search.operator.lowerThanNumber', twoValues: false },
  { type: 'number', operator: 'INSIDE', translation: '@pry.search.operator.innerBoundsNumber', twoValues: true },
  { type: 'number', operator: 'OUTSIDE', translation: '@pry.search.operator.outerBoundsNumber', twoValues: true },
  { type: 'date', operator: 'GREATER_THAN', translation: '@pry.search.operator.greaterThanDate', twoValues: false },
  { type: 'date', operator: 'LOWER_THAN', translation: '@pry.search.operator.lowerThanDate', twoValues: false },
  { type: 'date', operator: 'INSIDE', translation: '@pry.search.operator.innerBoundsDate', twoValues: true },
  { type: 'date', operator: 'OUTSIDE', translation: '@pry.search.operator.outerBoundsDate', twoValues: true }
];
