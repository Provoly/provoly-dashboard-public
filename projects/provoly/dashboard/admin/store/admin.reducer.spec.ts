import {Associations, BaseToolboxAction} from '@provoly/dashboard';
import { AdminActions } from './admin.actions';
import { adminReducer, initialAdminState } from './admin.reducer';

describe('Admin Reducer', () => {
  const initialState = Object.assign({}, initialAdminState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = adminReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('highlightMenu', () => {
    it('should be able to set highlightMenu menu admin', () => {
      expect(
        adminReducer(
          {
            ...initialState,
            highlightedMenu: 'a'
          },
          AdminActions.highlightMenu({ menu: 'b' })
        )
      ).toEqual({
        ...initialState,
        highlightedMenu: 'b'
      });
    });
  });

  describe('resetActions', () => {
    it('should be able to reset actions', () => {
      const action: BaseToolboxAction = {
        action: AdminActions.resetActions(),
        label: 'label',
        icon: 'icon'
      };
      expect(
        adminReducer(
          {
            ...initialState,
            actions: [action],
            subActions: [action]
          },
          AdminActions.resetActions()
        )
      ).toEqual({
        ...initialState,
        actions: [],
        subActions: []
      });
    });
  });
  describe('mainActions', () => {
    it('should be able to change main actions', () => {
      const action: BaseToolboxAction = {
        action: AdminActions.resetActions(),
        label: 'label',
        icon: 'icon'
      };
      expect(
        adminReducer(
          {
            ...initialState
          },
          AdminActions.mainActions({ actions: [action, { ...action, label: 'label2' }] })
        )
      ).toEqual({
        ...initialState,
        actions: [action, { ...action, label: 'label2' }]
      });
    });
  });
  describe('subActions', () => {
    it('should be able to change sub actions', () => {
      const action: BaseToolboxAction = {
        action: AdminActions.resetActions(),
        label: 'label',
        icon: 'icon'
      };
      expect(
        adminReducer(
          {
            ...initialState
          },
          AdminActions.subActions({ actions: [action, { ...action, label: 'label2' }] })
        )
      ).toEqual({
        ...initialState,
        subActions: [action, { ...action, label: 'label2' }]
      });
    });
  });
  describe('fetchAssociationSuccess', () => {
    it('should be able to update selectedAssociation', () => {
      const association: Associations = {
        id: 'Attribute123',
        associations: [
          {
            id: '12345',
            name: 'test association Attribute',
            type: 'dataset'
          }
        ],
        usedElsewhere: true
      };

      const action = AdminActions.fetchAssociationsSuccess({ association });

      const result = adminReducer(initialAdminState, action);

      expect(result).toEqual({
        ...initialAdminState,
        selectedAssociation: {
          id: association.id,
          associations: [{ ...association.associations[0] }],
          usedElsewhere: association.usedElsewhere
        }
      });
    });
  });
});
