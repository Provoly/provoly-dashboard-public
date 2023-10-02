import { users } from '../../../../mock/data/mockItemAdmin';
import { AdminUserActions } from './admin-user.action';
import { adminUserReducer, initialAdminUserState } from './admin-user.reducer';

describe('User Reducer', () => {
  const initialState = Object.assign({}, initialAdminUserState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = adminUserReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadUsersSuccess', () => {
    it('should set users', () => {
      expect(
        adminUserReducer(
          {
            ...initialState
          },
          AdminUserActions.loadUsersSuccess({ users: users })
        )
      ).toEqual({
        ...initialState,
        users: users
      });
    });
  });

  describe('selectUser', () => {
    it('should select User', () => {
      expect(
        adminUserReducer(
          {
            ...initialState,
            users: users
          },
          AdminUserActions.selectUser({ userId: 'idBuffy' })
        )
      ).toEqual({
        ...initialState,
        users: users,
        selectedUser: users[0]
      });
    });
  });

  describe('unselectUser', () => {
    it('should unselect User', () => {
      expect(
        adminUserReducer(
          {
            ...initialState
          },
          AdminUserActions.unselectUser()
        )
      ).toEqual({
        ...initialState,
        selectedUser: undefined
      });
    });
  });
});
