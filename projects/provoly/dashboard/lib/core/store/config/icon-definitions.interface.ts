import { ValueType } from '../../model/item.interface';

export interface IconOptions {
  iconUrl: string;
  iconSize: [number, number];
  rule?: IconRule;
  position?: IconPosition;
  isDefault?: boolean;
}

export type IconDefinitions = {
  [cl: string]: IconOptions[];
};

export const DEFAULT_ICON_URL = '/assets/svgs/default.svg';
export const DEFAULT_RESTITUTION_ICON_URL = '/assets/svgs/default-restitution.svg';
export const DEFAULT_DASHBOARD_ICON_URL = '/assets/svgs/default-dashboard.svg';

export enum IconPosition {
  FULL = 'FULL',
  TOP_LEFT = 'TOP_LEFT',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT'
}

export const compareOperationFunctions = {
  EQUALS: (a: any, b: any) => a === b,
  GREATER: (a: any, b: any) => parseInt(a, 10) > parseInt(b, 10),
  GREATER_OR_EQUAL: (a: any, b: any) => parseInt(a, 10) >= parseInt(b, 10),
  LOWER: (a: any, b: any) => parseInt(a, 10) < parseInt(b, 10),
  LOWER_OR_EQUAL: (a: any, b: any) => parseInt(a, 10) <= parseInt(b, 10),
  CONTAINS: (a: any, b: any) => (a + '').localeCompare(b + '') === 0
};

export type CompareOperation = keyof typeof compareOperationFunctions;

export interface IconRule {
  attributeName: string;
  value: ValueType;
  operation: CompareOperation;
}
