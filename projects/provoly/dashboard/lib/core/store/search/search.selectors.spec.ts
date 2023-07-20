import * as fromSearch from './search.reducer';
import { initialSearchState, SearchState } from './search.reducer';
import { SearchSelectors } from './search.selectors';

const buildState = (state: Partial<SearchState>) =>
  Object.assign({}, { '@pry/search': JSON.parse(JSON.stringify({ ...initialSearchState, ...state })) });

describe('Search Selectors', () => {
  it('should select the feature state', () => {
    const result = SearchSelectors.feature({
      [fromSearch.searchFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
