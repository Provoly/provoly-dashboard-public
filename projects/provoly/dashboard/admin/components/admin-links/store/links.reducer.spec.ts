import { linksDetails } from '@provoly/dashboard/mock/data/mockItemAdmin';
import { LinksActions } from './links.actions';
import { initialLinkState, linkReducer } from './links.reducer';

describe('Link Reducer', () => {
  const initialState = Object.assign({}, initialLinkState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = linkReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadLinksSuccess', () => {
    it('should set links', () => {
      expect(
        linkReducer(
          {
            ...initialState
          },
          LinksActions.loadLinksSuccess({ datas: linksDetails })
        )
      ).toEqual({
        ...initialState,
        links: linksDetails
      });
    });
  });
});
