import { users } from '../../../../mock/data/mockItemAdmin';
import * as fromAdminUser from './admin-user.reducer';
import { initialAdminUserState } from './admin-user.reducer';
import { AdminUserSelectors } from './admin-user.selector';

describe('User Selectors', () => {
  const initialState = Object.assign({}, initialAdminUserState);
  it('should select the feature state', () => {
    const result = AdminUserSelectors.feature({
      [fromAdminUser.adminUserFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('users', () => {
    it('should return empty array', () => {
      const result = AdminUserSelectors.users.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return Users', () => {
      const result = AdminUserSelectors.users.projector({
        ...initialState,
        users: users
      });
      expect(result[0]).toEqual(users[0]);
    });
  });

  describe('selectedUser', () => {
    it('should return empty selectedUser', () => {
      const result = AdminUserSelectors.selectedUser.projector(initialState);
      expect(result).toEqual(undefined);
    });
    it('should return selectedUser', () => {
      const result = AdminUserSelectors.selectedUser.projector({
        ...initialState,
        selectedUser: users[0]
      });
      expect(result).toEqual(users[0]);
    });
  });
});
