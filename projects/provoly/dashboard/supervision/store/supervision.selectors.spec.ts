import { Infrastructure, IntegrationError } from './supervision-api.model';
import * as fromSupervision from './supervision.reducer';
import { initialSupervisionState } from './supervision.reducer';
import { SupervisionSelectors } from './supervision.selectors';

describe('Supervision Selectors', () => {
  const initialState = { ...initialSupervisionState };
  it('should select the feature state', () => {
    const result = SupervisionSelectors.feature({
      [fromSupervision.supervisionFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('highlightedMenu', () => {
    it('should return first item on init', () => {
      const result = SupervisionSelectors.highlightedMenu.projector(initialState);

      expect(result).toEqual('infrastructures');
    });
    it('should return "menu"', () => {
      const result = SupervisionSelectors.highlightedMenu.projector({
        ...initialState,
        highlightedMenu: 'test'
      });

      expect(result).toEqual('test');
    });
  });
  describe('lastInfraScale', () => {
    it('should return undefined', () => {
      const result = SupervisionSelectors.lastInfraScale.projector(initialState);

      expect(result).toEqual(undefined);
    });
    it('should return correct lastInfraScale', () => {
      const result = SupervisionSelectors.lastInfraScale.projector({
        ...initialState,
        lastInfraScale: { name: 'name', time: 'time', up: true }
      });

      expect(result).toEqual({ name: 'name', time: 'time', up: true });
    });
  });

  describe('menus', () => {
    it('should return "menu"', () => {
      const result = SupervisionSelectors.menus.projector({
        ...initialState,
        menus: [{ menu: 'menu1' }, { menu: 'menu2' }, { menu: 'menu3' }]
      });
      expect(result.length).toEqual(3);
      expect(result[2]).toEqual({ menu: 'menu3' });
    });
  });
  describe('infrastructures', () => {
    it('should return empty array', () => {
      const result = SupervisionSelectors.infrastructures.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return infra', () => {
      const infra = {
        available: 1,
        hotScale: true,
        maxReplicas: 1,
        minReplicas: 1,
        missing: false,
        name: 'name',
        replicas: 1,
        title: 'title'
      } as Infrastructure;
      const result = SupervisionSelectors.infrastructures.projector({
        ...initialState,
        infrastructures: [infra]
      });
      expect(result[0]).toEqual(infra);
    });
  });
  describe('integration errors', () => {
    const error = {
      oClass: '123',
      errors: [
        {
          label: 'unknown error',
          count: 23
        }
      ]
    } as IntegrationError;
    it('should return empty array', () => {
      const result = SupervisionSelectors.integrationErrors.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return integration errors', () => {
      const result = SupervisionSelectors.integrationErrors.projector({
        ...initialState,
        integrationErrors: [error]
      });
      expect(result[0]).toEqual(error);
    });
    it('should return current integration error', () => {
      const result = SupervisionSelectors.currentIntegrationError.projector({
        ...initialState,
        currentIntegrationError: error
      });
      expect(result).toEqual(error);
    });
    it('should return selected classes', () => {
      const result = SupervisionSelectors.selectedClasses.projector({
        ...initialState,
        selectedClasses: [error.oClass]
      });
      expect(result[0]).toEqual(error.oClass);
    });
    it('should return refresh interval', () => {
      const result = SupervisionSelectors.refreshInterval.projector(initialState);
      expect(result).toEqual(30000);
    });
  });
  describe('loading', () => {
    it('should return false', () => {
      const result = SupervisionSelectors.loading.projector(initialState);
      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = SupervisionSelectors.loading.projector({ ...initialState, loading: true });
      expect(result).toEqual(true);
    });
  });
});
