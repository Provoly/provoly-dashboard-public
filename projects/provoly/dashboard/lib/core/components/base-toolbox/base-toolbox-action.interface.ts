import { Action } from '@ngrx/store';

export interface BaseToolboxAction {
  icon?: string;
  label: string;
  action?: Action;
  accentColor?: boolean;
  actions?: BaseToolboxAction[];
  moduleAccess?: string;
  pageAccess?: string;
  actionAccess?: string;
  disabled?: boolean;
}
