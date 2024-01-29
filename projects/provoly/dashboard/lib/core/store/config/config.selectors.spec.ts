import * as fromConfig from './config.reducer';
import { ConfigState, initialConfigState } from './config.reducer';
import { ConfigSelectors } from './config.selectors';

describe('Config Selectors', () => {
  const initialState = Object.assign({}, initialConfigState);

  it('should select the feature state', () => {
    const result = ConfigSelectors.feature({
      [fromConfig.configFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  describe('pryUrl', () => {
    it('should return empty on init', () => {
      const result = ConfigSelectors.pryUrl.projector(initialState);

      expect(result).toEqual('');
    });
    it('should return "urlPry"', () => {
      const result = ConfigSelectors.pryUrl.projector({ ...initialState, pryUrl: 'urlPry' } as ConfigState);

      expect(result).toEqual('urlPry');
    });
  });

  describe('selectRefUrl', () => {
    it('should return /ref pryUrl is empty', () => {
      const result = ConfigSelectors.refUrl.projector('');

      expect(result).toEqual('/ref');
    });
    it('should return "url/ref" if pryUrl is "url"', () => {
      const result = ConfigSelectors.refUrl.projector('url');

      expect(result).toEqual('url/ref');
    });
  });
  describe('dataUrl', () => {
    it('should return /data pryUrl is empty', () => {
      const result = ConfigSelectors.dataUrl.projector('');

      expect(result).toEqual('/data');
    });
    it('should return "url/data" if pryUrl is "url"', () => {
      const result = ConfigSelectors.dataUrl.projector('url');

      expect(result).toEqual('url/data');
    });
  });

  describe('mapUrl', () => {
    it('should return empty on init', () => {
      const result = ConfigSelectors.mapUrl.projector(initialState);

      expect(result).toEqual('');
    });
    it('should return "mapUrl"', () => {
      const result = ConfigSelectors.mapUrl.projector({ ...initialState, mapUrl: 'mapUrl' } as ConfigState);

      expect(result).toEqual('mapUrl');
    });
  });

  describe('iconDefinitions', () => {
    it('should default to nothing', () => {
      expect(ConfigSelectors.iconDefinitions.projector(initialState)).toEqual({
        default: [
          {
            iconUrl: '/assets/svgs/default.svg',
            iconSize: [25, 25]
          }
        ]
      });
    });

    it('should give icon definitions', () => {
      expect(
        ConfigSelectors.iconDefinitions.projector({
          ...initialState,
          iconDefinitions: {
            a: [{ iconUrl: 'a', iconSize: [25, 25] }],
            b: [{ iconUrl: 'b', iconSize: [25, 25] }]
          }
        })
      ).toEqual({
        a: [
          { iconUrl: 'a', iconSize: [25, 25] },
          { iconUrl: 'a', iconSize: [25, 25], isDefault: true }
        ],
        b: [
          { iconUrl: 'b', iconSize: [25, 25] },
          { iconUrl: 'b', iconSize: [25, 25], isDefault: true }
        ],
        default: [{ iconUrl: '/assets/svgs/default.svg', iconSize: [25, 25] }]
      });
    });
  });

  it('should return a boolean indicating if there is an overlay', () => {
    const result = ConfigSelectors.hasOverlay.projector({
      ...initialState,
      overlayList: ['overlay']
    });
    expect(result).toEqual(true);
  });

  it('should return maximum number of attributes in a tile widget', () => {
    const result = ConfigSelectors.maxAttributesInTiles.projector({
      ...initialState
    });
    expect(result).toEqual(5);
  });

  describe('limits', () => {
    it('should return default limit to 200', () => {
      const result = ConfigSelectors.limits.projector(initialState);

      expect(result).toEqual({ default: 200 });
    });
    it('should return current limit with default potentially overloaded', () => {
      const result = ConfigSelectors.limits.projector({ ...initialState, limits: { default: 500, dataset: 1200 } });

      expect(result).toEqual({ default: 500, dataset: 1200 });
    });
  });
});
