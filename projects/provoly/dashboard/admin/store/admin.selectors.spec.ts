import * as fromAdmin from './admin.reducer';
import { AdminState, initialAdminState } from './admin.reducer';
import { AdminSelectors } from './admin.selectors';
import {associations} from "@provoly/dashboard/mock/data/mockItemAdmin";

describe('Admin Selectors', () => {
  const initialState = Object.assign({}, initialAdminState);
  it('should select the feature state', () => {
    const result = AdminSelectors.feature({
      [fromAdmin.adminFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('highlightedMenu', () => {
    it('should return first item on init', () => {
      const result = AdminSelectors.highlightedMenu.projector(initialState);

      expect(result).toEqual('environment');
    });
    it('should return "menu"', () => {
      const result = AdminSelectors.highlightedMenu.projector({
        ...initialState,
        highlightedMenu: 'menu'
      });

      expect(result).toEqual('menu');
    });
  });
  describe('selectedAssociation', () => {
    it('should return selected association', () => {
      const selectedAssociation = associations;
      const mockStateWithAssociation = {
        ...initialState,
        selectedAssociation: selectedAssociation
      };
      // @ts-ignore
      const result = AdminSelectors.selectedAssociation.projector(mockStateWithAssociation);
      expect(result).toEqual(selectedAssociation);
    });

    it('should return undefined when no association is selected', () => {
      const result = AdminSelectors.selectedAssociation.projector(initialState);
      expect(result).toBeUndefined();
    });
  });
});
