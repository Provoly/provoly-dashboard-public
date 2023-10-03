import { metadata } from '../../../../mock/data/mockItemAdmin';
import { AdminMetadataUserActions } from './admin-metadata-user.action';
import { adminMetadataUserReducer, initialAdminUserState } from './admin-metadata-user.reducer';

describe('Metadata Reducer', () => {
  const initialState = Object.assign({}, initialAdminUserState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = adminMetadataUserReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('select Metadata', () => {
    it('should set current predicates', () => {
      expect(
        adminMetadataUserReducer(
          {
            ...initialState
          },
          AdminMetadataUserActions.selectMetadata({ id: metadata[0].id })
        )
      ).toEqual({
        ...initialState,
        selectedMetadataId: metadata[0].id
      });
    });
  });
});
