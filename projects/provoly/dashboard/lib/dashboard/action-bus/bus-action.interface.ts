import { Action } from '@ngrx/store';

export interface BusAction extends Action {
  sender: string;
}
