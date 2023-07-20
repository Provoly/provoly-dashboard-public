import { createReducer, on } from '@ngrx/store';
import { MetadataUser, UserInfo } from '@provoly/dashboard';
import { AdminUserActions } from './admin-user.action';

export const adminUserFeatureKey = '@pry/admin/user';

export interface AdminUserState {
  users: Array<UserInfo>;
  selectedUser?: UserInfo;
  selectedMetadataUser: Array<MetadataUser>;
  editable: boolean;
}

export const initialAdminUserState: AdminUserState = {
  users: [],
  selectedMetadataUser: [],
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
    selectedUser: undefined,
    selectedMetadataUser: []
  })),
  on(AdminUserActions.loadMetadataUserSuccess, (state, action) => ({
    ...state,
    selectedMetadataUser: action.metadata
  })),
  on(AdminUserActions.isEditable, (state, action) => ({
    ...state,
    editable: action.editable
  }))
);
