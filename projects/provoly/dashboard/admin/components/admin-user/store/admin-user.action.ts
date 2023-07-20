import { createAction, props } from '@ngrx/store';
import { MetadataUser, UserInfo } from '@provoly/dashboard';

const BASE = '[Admin/User]';
const BASEAPI = '[Admin/User Api]';

export const AdminUserActions = {
  loadUsers: createAction(`${BASE} Load Users`),
  loadUsersSuccess: createAction(`${BASEAPI} Load Users Success`, props<{ users: Array<UserInfo> }>()),
  loadUsersFailure: createAction(`${BASEAPI} Load Users Failure`, props<{ error: any }>()),

  selectUser: createAction(`${BASE} Select User`, props<{ userId: string }>()),
  unselectUser: createAction(`${BASE} unSelect User`),

  isEditable: createAction(`${BASE} Is editable`, props<{ editable: boolean }>()),

  loadMetadataUser: createAction(`${BASE} Load Metadata of selected Users`, props<{ userId: string }>()),
  loadMetadataUserSuccess: createAction(
    `${BASEAPI} Load Metadata of selected Users Success`,
    props<{ metadata: Array<MetadataUser> }>()
  ),
  loadMetadataUserFailure: createAction(`${BASEAPI} Load Metadata of selected Users Failure`, props<{ error: any }>()),

  addMetadataUser: createAction(
    `${BASE} Add Metadata of selected Users`,
    props<{ userId: string; metaId: string; value: any }>()
  ),
  addMetadataUserSuccess: createAction(
    `${BASEAPI} Add Metadata of selected Users Success`,
    props<{ userId: string }>()
  ),
  addMetadataUserFailure: createAction(`${BASEAPI} Add Metadata of selected Users Failure`, props<{ error: any }>()),

  deleteMetadataUser: createAction(
    `${BASE} Delete Metadata of selected Users`,
    props<{ userId: string; metadataId: string }>()
  ),
  deleteMetadataUserSuccess: createAction(
    `${BASEAPI} Delete Metadata of selected Users Success`,
    props<{ userId: string }>()
  ),
  deleteMetadataUserFailure: createAction(
    `${BASEAPI} Delete Metadata of selected Users Failure`,
    props<{ error: any }>()
  )
};
