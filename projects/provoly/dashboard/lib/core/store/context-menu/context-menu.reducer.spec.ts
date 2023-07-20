import { contextMenuReducer, initialContextMenuState } from './context-menu.reducer';
import { ContextMenuActions } from './context-menu.actions';

describe('ContextMenu Reducer', () => {
  const initialState = Object.assign({}, initialContextMenuState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = contextMenuReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('open', () => {
    it('should set opened and others on open', () => {
      expect(
        contextMenuReducer(
          {
            ...initialState
          },
          ContextMenuActions.open({ clientX: 12, clientY: 20, itemId: 'item-id', resultSet: 'rs', from: 'tests' })
        )
      ).toEqual({
        ...initialState,
        opened: true,
        clientX: 12,
        clientY: 20,
        itemId: 'item-id',
        resultSet: 'rs',
        from: 'tests'
      });
    });
  });

  describe('hide', () => {
    it('should set opened to false and reset itemid', () => {
      expect(
        contextMenuReducer(
          {
            ...initialState
          },
          ContextMenuActions.hide()
        )
      ).toEqual({
        ...initialState,
        opened: false,
        itemId: '',
        resultSet: undefined
      });
    });
  });
});
