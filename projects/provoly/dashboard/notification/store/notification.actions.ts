import { createAction, props } from '@ngrx/store';
import { PryNotification } from '@provoly/dashboard';

export const NotificationActions = {
  add: createAction('[Notification] received', props<{ notification: PryNotification }>()),
  delete: createAction('[Notification] delete', props<{ id: string }>()),
  deleteSuccess: createAction('[Notification] delete success', props<{ id: string }>()),
  deleteAll: createAction('[Notification] delete all'),
  deleteAllSuccess: createAction('[Notification] delete all success')
};
