export interface AbacRule {
  id: string;
  name: string;
  type: AbacRuleType;
  predicate: string;
  condition?: Condition;
  description: string;
  active: boolean;
}

export type AbacRuleType = 'METADATA' | 'ATTRIBUTE';

export type ConditionType = 'METADATA' | 'ATTRIBUTE' | 'OR' | 'AND';

export interface Condition {
  type: ConditionType;
  composed?: Array<Condition>;
  attribute?: string;
  metadata?: string;
  value?: string | number;
  operator?: OperatorType;
}

export interface NormalizedCondition {
  id: string;
  type: ConditionType;
  parentId: string;
  composed?: string[];
  attribute?: string;
  metadata?: string;
  value?: string | number;
  operator?: OperatorType;
}

export type OperatorType =
  | 'EQUALS'
  | 'CONTAINS'
  | 'START_WITH'
  | 'END_WITH'
  | 'GREATER_THAN'
  | 'LOWER_THAN'
  | 'INNER_BOUNDS'
  | 'OUTER_BOUNDS'
  | 'NOT_EQUALS'
  | 'IN'
  | 'NOT_IN';

export interface OperatorOption {
  type: 'string' | 'number' | 'date';
  operator: OperatorType;
  translation: string;
  twoValues: boolean;
}

export const OPERATOR_OPTIONS: OperatorOption[] = [
  { type: 'string', operator: 'CONTAINS', translation: '@pry.search.operator.contains', twoValues: false },
  { type: 'string', operator: 'START_WITH', translation: '@pry.search.operator.startWith', twoValues: false },
  { type: 'string', operator: 'END_WITH', translation: '@pry.search.operator.endWith', twoValues: false },
  { type: 'string', operator: 'EQUALS', translation: '@pry.search.operator.equalsString', twoValues: false },
  { type: 'string', operator: 'NOT_EQUALS', translation: '@pry.search.operator.notEqualsString', twoValues: false },
  { type: 'number', operator: 'EQUALS', translation: '@pry.search.operator.equalsNumber', twoValues: false },
  { type: 'number', operator: 'NOT_EQUALS', translation: '@pry.search.operator.notEqualsString', twoValues: false },
  { type: 'number', operator: 'GREATER_THAN', translation: '@pry.search.operator.greaterThanNumber', twoValues: false },
  { type: 'number', operator: 'LOWER_THAN', translation: '@pry.search.operator.lowerThanNumber', twoValues: false },
  { type: 'number', operator: 'INNER_BOUNDS', translation: '@pry.search.operator.innerBoundsNumber', twoValues: true },
  { type: 'number', operator: 'OUTER_BOUNDS', translation: '@pry.search.operator.outerBoundsNumber', twoValues: true },
  { type: 'date', operator: 'EQUALS', translation: '@pry.search.operator.equalsNumber', twoValues: false },
  { type: 'date', operator: 'NOT_EQUALS', translation: '@pry.search.operator.notEqualsNumber', twoValues: false },
  { type: 'date', operator: 'GREATER_THAN', translation: '@pry.search.operator.greaterThanDate', twoValues: false },
  { type: 'date', operator: 'LOWER_THAN', translation: '@pry.search.operator.lowerThanDate', twoValues: false },
  { type: 'date', operator: 'INNER_BOUNDS', translation: '@pry.search.operator.innerBoundsDate', twoValues: true },
  { type: 'date', operator: 'OUTER_BOUNDS', translation: '@pry.search.operator.outerBoundsDate', twoValues: true },
  { type: 'number', operator: 'IN', translation: '@pry.search.operator.in', twoValues: false },
  { type: 'number', operator: 'NOT_IN', translation: '@pry.search.operator.not_in', twoValues: false },
  { type: 'date', operator: 'IN', translation: '@pry.search.operator.in', twoValues: false },
  { type: 'date', operator: 'NOT_IN', translation: '@pry.search.operator.not_in', twoValues: false },
  { type: 'string', operator: 'IN', translation: '@pry.search.operator.in', twoValues: false },
  { type: 'string', operator: 'NOT_IN', translation: '@pry.search.operator.not_in', twoValues: false }
];

export interface AbacRulesConditions {
  masterId: string | null;
  ids: string[];
  entities: {
    [key: string]: NormalizedCondition;
  };
}
