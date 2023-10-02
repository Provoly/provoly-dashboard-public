import { createReducer, on } from '@ngrx/store';
import { UserInfo } from '@provoly/dashboard';
import { AdminUserActions } from './admin-user.action';

export const adminUserFeatureKey = '@pry/admin/user';

export interface AdminUserState {
  users: Array<UserInfo>;
  selectedUser?: UserInfo;
  editable: boolean;
}

export const initialAdminUserState: AdminUserState = {
  users: [],
  editable: false
};

export const adminUserReducer = createReducer(
  initialAdminUserState,
  on(AdminUserActions.loadUsersSuccess, (state, action) => ({
    ...state,
    users: [...action.users]
  })),
  on(AdminUserActions.selectUser, (state, action) => ({
    ...state,
    selectedUser: state.users.find((user) => user.id == action.userId),
    editable: false
  })),
  on(AdminUserActions.unselectUser, (state, action) => ({
    ...state,
    selectedUser: undefined
  })),
  on(AdminUserActions.isEditable, (state, action) => ({
    ...state,
    editable: action.editable
  }))
);
