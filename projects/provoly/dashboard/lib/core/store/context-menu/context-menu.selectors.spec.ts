import * as fromContextMenu from './context-menu.reducer';
import { ContextMenuState, initialContextMenuState } from './context-menu.reducer';
import { ContextMenuSelectors } from './context-menu.selectors';

describe('ContextMenu Selectors', () => {
  const initialState = Object.assign({}, initialContextMenuState);
  it('should select the feature state', () => {
    const result = ContextMenuSelectors.feature({
      [fromContextMenu.contextMenuFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('opened', () => {
    it('should return empty on init', () => {
      const result = ContextMenuSelectors.opened.projector(initialState);

      expect(result).toEqual(false);
    });
    it('should return true', () => {
      const result = ContextMenuSelectors.opened.projector({ ...initialState, opened: true } as ContextMenuState);

      expect(result).toEqual(true);
    });
  });

  describe('position', () => {
    it('should return empty position in init', () => {
      const result = ContextMenuSelectors.position.projector(initialState);

      expect(result).toEqual({ clientX: 0, clientY: 0 });
    });

    it('should return current position', () => {
      const result = ContextMenuSelectors.position.projector({ ...initialState, clientX: 124, clientY: 3 });

      expect(result).toEqual({ clientX: 124, clientY: 3 });
    });
  });

  describe('itemId', () => {
    it('should init with empty', () => {
      const result = ContextMenuSelectors.itemId.projector(initialState);

      expect(result).toEqual('');
    });
    it('should else return the current itemId', () => {
      const result = ContextMenuSelectors.itemId.projector({ ...initialState, itemId: 'item-id' });

      expect(result).toEqual('item-id');
    });
  });

  describe('resultSet', () => {
    it('should init with undefined', () => {
      const result = ContextMenuSelectors.resultSet.projector(initialState);

      expect(result).toEqual(undefined);
    });
    it('should else return the current resultSet', () => {
      const result = ContextMenuSelectors.resultSet.projector({ ...initialState, resultSet: 'rs' });

      expect(result).toEqual('rs');
    });
  });

  describe('from', () => {
    it('should init with empty string', () => {
      const result = ContextMenuSelectors.from.projector(initialState);

      expect(result).toEqual('');
    });
    it('should else return the current from', () => {
      const result = ContextMenuSelectors.from.projector({ ...initialState, from: 'test' });

      expect(result).toEqual('test');
    });
  });

  describe('coordinates', () => {
    it('should init with undefined', () => {
      const result = ContextMenuSelectors.coordinates.projector(initialState);

      expect(result).toEqual(undefined);
    });
    it('should else return the current coordinates', () => {
      const result = ContextMenuSelectors.coordinates.projector({ ...initialState, coordinates: [1, 3] });

      expect(result).toEqual([1, 3]);
    });
  });
});
