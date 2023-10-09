import { createReducer, on } from '@ngrx/store';
import { ContextMenuActions } from './context-menu.actions';

export const contextMenuFeatureKey = '@pry/context-menu';

export interface ContextMenuState {
  opened: boolean;
  clientX: number;
  clientY: number;
  itemId: string;
  from: string;
  resultSet: string | undefined;
  coordinates: number[] | undefined;
  allowObjectCreation: boolean;
}

export const initialContextMenuState: ContextMenuState = {
  opened: false,
  clientX: 0,
  clientY: 0,
  itemId: '',
  from: '',
  resultSet: undefined,
  coordinates: undefined,
  allowObjectCreation: false
};

export const contextMenuReducer = createReducer(
  initialContextMenuState,
  on(ContextMenuActions.open, (state, action) => ({
    ...state,
    opened: true,
    clientX: action.clientX,
    clientY: action.clientY,
    itemId: action.itemId,
    resultSet: action.resultSet,
    from: action.from,
    coordinates: action.coordinates,
    allowObjectCreation: action.allowObjectCreation
  })),
  on(ContextMenuActions.hide, (state, action) => ({
    ...state,
    opened: false,
    itemId: '',
    resultSet: undefined,
    from: ''
  }))
);
