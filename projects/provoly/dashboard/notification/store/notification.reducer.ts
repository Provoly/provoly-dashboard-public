import { createReducer, on } from '@ngrx/store';
import { PryNotification } from '@provoly/dashboard';
import { NotificationActions } from './notification.actions';

export interface NotificationState {
  list: PryNotification[];
}

export const initialNotificationState: NotificationState = {
  list: []
};

export const notificationReducer = createReducer(
  initialNotificationState,
  on(NotificationActions.add, (state, action) => {
    const allNotifications = [...state.list, { ...action.notification }];
    const uniqueIds = [...new Set(allNotifications.map((notif) => notif.id))];
    return {
      ...state,
      list: uniqueIds.map((id) => allNotifications.find((notif) => notif.id === id)) as PryNotification[]
    };
  }),
  on(NotificationActions.deleteSuccess, (state, action) => ({
    ...state,
    list: state.list.filter((notification: PryNotification) => notification.id !== action.id)
  })),
  on(NotificationActions.deleteAllSuccess, (state, action) => ({
    ...state,
    list: []
  }))
);
