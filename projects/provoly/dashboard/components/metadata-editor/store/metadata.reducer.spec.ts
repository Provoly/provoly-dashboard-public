import { IMetadata, VARIABLE_TYPE } from '@provoly/dashboard';
import { metadataUser } from '@provoly/dashboard/mock/data/mockItemAdmin';
import { MetadataActions } from './metadata.action';
import { initialMetadataState, metadataReducer } from './metadata.reducer';

describe('Metadata Reducer', () => {
  const initialState = Object.assign({}, initialMetadataState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = metadataReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadMetadata', () => {
    it('should change loading', () => {
      expect(
        metadataReducer(
          {
            ...initialState
          },
          MetadataActions.loadMetadata()
        )
      ).toEqual({
        ...initialState,
        loading: true
      });
    });
  });
  describe('loadInfrasSuccess', () => {
    it('should set two predicates', () => {
      const metadata: IMetadata = {
        id: '1',
        name: 'name1',
        type: VARIABLE_TYPE.STRING
      };
      expect(
        metadataReducer(
          {
            ...initialState
          },
          MetadataActions.loadMetadataSuccess({ metadata: [metadata, { ...metadata, name: 'name2' }] })
        )
      ).toEqual({
        ...initialState,
        metadata: [metadata, { ...metadata, name: 'name2' }]
      });
    });
  });
  describe('loadInfrasFailure', () => {
    it('should change loading', () => {
      expect(
        metadataReducer(
          {
            ...initialState,
            loading: true
          },
          MetadataActions.loadMetadataFailure({ error: 'error' })
        )
      ).toEqual({
        ...initialState,
        loading: false,
        errors: 'error'
      });
    });
  });
  describe('loadMetadataUserSuccess', () => {
    it('should load metadata User', () => {
      expect(
        metadataReducer(
          {
            ...initialState
          },
          MetadataActions.loadMetadataUserSuccess({ metadata: metadataUser })
        )
      ).toEqual({
        ...initialState,
        selectedUserProfile: metadataUser
      });
    });
  });
});
