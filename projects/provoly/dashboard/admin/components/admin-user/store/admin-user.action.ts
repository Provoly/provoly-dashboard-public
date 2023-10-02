import { createAction, props } from '@ngrx/store';
import { UserInfo } from '@provoly/dashboard';

const BASE = '[Admin/User]';
const BASEAPI = '[Admin/User Api]';

export const AdminUserActions = {
  loadUsers: createAction(`${BASE} Load Users`),
  loadUsersSuccess: createAction(`${BASEAPI} Load Users Success`, props<{ users: Array<UserInfo> }>()),
  loadUsersFailure: createAction(`${BASEAPI} Load Users Failure`, props<{ error: any }>()),

  selectUser: createAction(`${BASE} Select User`, props<{ userId: string }>()),
  unselectUser: createAction(`${BASE} unSelect User`),

  isEditable: createAction(`${BASE} Is editable`, props<{ editable: boolean }>())
};
