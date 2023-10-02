import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAdminUser from './admin-user.reducer';

const feature = createFeatureSelector<fromAdminUser.AdminUserState>(fromAdminUser.adminUserFeatureKey);
const users = createSelector(feature, (state) => state?.users);
const selectedUser = createSelector(feature, (state) => state?.selectedUser);
const editable = createSelector(feature, (state) => state.editable);

export const AdminUserSelectors = {
  feature,
  users,
  selectedUser,
  editable
};
