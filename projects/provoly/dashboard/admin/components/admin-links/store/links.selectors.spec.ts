import { linksDetails } from '@provoly/dashboard/mock/data/mockItemAdmin';
import * as fromLink from './links.reducer';
import { initialLinkState } from './links.reducer';
import { LinksSelectors } from './links.selectors';

describe('Links Selectors', () => {
  const initialState = Object.assign({}, initialLinkState);
  it('should select the feature state', () => {
    const result = LinksSelectors.feature({
      [fromLink.linksFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('links', () => {
    it('should return empty array', () => {
      const result = LinksSelectors.links.projector(initialState);
      expect(result).toEqual([]);
    });
    it('should return RelationsTypes', () => {
      const result = LinksSelectors.links.projector({
        ...initialState,
        links: linksDetails
      });
      expect(result[0]).toEqual(linksDetails[0]);
    });
  });
});
