import { createFeatureSelector, createSelector } from '@ngrx/store';
import { notificationFeatureKey } from '@provoly/dashboard';
import * as fromNotification from './notification.reducer';

const feature = createFeatureSelector<fromNotification.NotificationState>(notificationFeatureKey);

const list = createSelector(feature, (state) => state.list);

export const NotificationSelectors = {
  feature,
  list
};
