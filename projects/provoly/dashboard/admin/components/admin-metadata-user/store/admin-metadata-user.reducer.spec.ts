import { IMetadata, VARIABLE_TYPE } from '@provoly/dashboard';
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

  describe('loadMetadata', () => {
    it('should change loading', () => {
      expect(
        adminMetadataUserReducer(
          {
            ...initialState
          },
          AdminMetadataUserActions.loadMetadata()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadMetadataSuccess', () => {
    it('should set two metadata', () => {
      expect(
        adminMetadataUserReducer(
          {
            ...initialState
          },
          AdminMetadataUserActions.loadMetadataSuccess({
            metadata: [metadata[0], { ...metadata[0], name: 'name2' }]
          })
        )
      ).toEqual({
        ...initialState,
        metadata: [metadata[0], { ...metadata[0], name: 'name2' }]
      });
    });
  });
  describe('loadInfrasFailure', () => {
    it('should change loading', () => {
      expect(
        adminMetadataUserReducer(
          {
            ...initialState,
            loading: true
          },
          AdminMetadataUserActions.loadMetadataFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false,
        errors: 'error'
      });
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
        selectedMetadata: metadata[0].id
      });
    });
  });

  describe('update metadata', () => {
    it('should change loading', () => {
      const metadata: IMetadata = {
        id: '1',
        name: 'name1',
        type: VARIABLE_TYPE.INTEGER
      };
      expect(
        adminMetadataUserReducer(
          {
            ...initialState
          },
          AdminMetadataUserActions.updateMetadata({ metadata: { ...metadata, name: 'new' } })
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('update metadata success', () => {
    it('should change loading', () => {
      const metadata: IMetadata = {
        id: '1',
        name: 'name1',
        type: VARIABLE_TYPE.INTEGER
      };

      expect(
        adminMetadataUserReducer(
          {
            ...initialState,
            loading: false
          },
          AdminMetadataUserActions.updateMetadata({ metadata })
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('update metadata failure', () => {
    it('should change loading', () => {
      expect(
        adminMetadataUserReducer(
          {
            ...initialState,
            loading: true
          },
          AdminMetadataUserActions.updateMetadataFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false,
        errors: 'error'
      });
    });
  });
});
