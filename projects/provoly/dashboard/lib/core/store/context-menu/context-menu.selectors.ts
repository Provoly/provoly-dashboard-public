import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromContextMenu from './context-menu.reducer';

const feature = createFeatureSelector<fromContextMenu.ContextMenuState>(fromContextMenu.contextMenuFeatureKey);

const opened = createSelector(feature, (state) => state?.opened);
const position = createSelector(feature, (state) => ({ clientX: state?.clientX ?? 0, clientY: state?.clientY ?? 0 }));
const itemId = createSelector(feature, (state) => state.itemId);
const from = createSelector(feature, (state) => state.from);
const coordinates = createSelector(feature, (state) => state.coordinates);
const resultSet = createSelector(feature, (state) => state.resultSet);

export const ContextMenuSelectors = {
  feature,
  opened,
  position,
  itemId,
  resultSet,
  from,
  coordinates
};
