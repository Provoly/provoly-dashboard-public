import { createAction, props } from '@ngrx/store';

export const ContextMenuActions = {
  open: createAction(
    '[ContextMenu] open',
    props<{
      itemId: string;
      clientX: number;
      clientY: number;
      resultSet?: string;
      from: string;
      coordinates?: number[];
    }>()
  ),
  hide: createAction('[ContextMenu] hide')
};
