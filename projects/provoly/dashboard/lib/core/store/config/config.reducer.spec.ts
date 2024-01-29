import {
  Aggregation,
  ChartOptionDefault,
  MarkSubType,
  MarkType,
  PryVisibilityType,
  VegaColorType
} from '@provoly/dashboard';
import { ConfigActions } from './config.actions';
import { configReducer, initialConfigState } from './config.reducer';

describe('Config Reducer', () => {
  const initialState = Object.assign({}, initialConfigState);

  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = configReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('config', () => {
    it('should set mapUrl to "newMapUrl" and keep pryUrl unchanged', () => {
      expect(
        configReducer(
          {
            ...initialState,
            mapUrl: 'mapUrl',
            pryUrl: 'pryUrl'
          },
          ConfigActions.defineUrls({ mapUrl: 'newMapUrl' })
        )
      ).toEqual({
        ...initialState,
        mapUrl: 'newMapUrl',
        pryUrl: 'pryUrl'
      });
    });
    it('should set pryUrl to "newPryUrl" and keep mapUrl unchanged', () => {
      expect(
        configReducer(
          {
            ...initialState,
            mapUrl: 'mapUrl',
            pryUrl: 'pryUrl'
          },
          ConfigActions.defineUrls({ pryUrl: 'newPryUrl' })
        )
      ).toEqual({
        ...initialState,
        mapUrl: 'mapUrl',
        pryUrl: 'newPryUrl'
      });
    });
  });

  describe('defineOverlayTemplate', () => {
    it('should input templates into store, with the default one', () => {
      expect(
        configReducer(
          {
            ...initialState,
            tooltipDefinitions: {}
          },
          ConfigActions.updateTooltip({
            definitions: {
              a: {
                type: 'attributes',
                options: { attributes: ['id', 'a'] }
              }
            }
          })
        )
      ).toEqual({
        ...initialState,
        tooltipDefinitions: {
          a: {
            type: 'attributes',
            options: { attributes: ['id', 'a'] }
          }
        }
      });
    });
  });

  describe('defineIcons', () => {
    it('should input icons into store, with the default one', () => {
      expect(
        configReducer(
          {
            ...initialState,
            iconDefinitions: {}
          },
          ConfigActions.updateIcons({ definitions: { a: [{ iconUrl: 'aze', iconSize: [25, 25] }] } })
        )
      ).toEqual({
        ...initialState,
        iconDefinitions: {
          a: [{ iconUrl: 'aze', iconSize: [25, 25] }]
        }
      });
    });
  });

  describe('defineMapStyles', () => {
    it('should input styles into store', () => {
      expect(
        configReducer(
          {
            ...initialState,
            mapStyles: []
          },
          ConfigActions.defineMapStyles({ styles: [{ identifier: 'aaa', label: 'Aaa' }] })
        )
      ).toEqual({
        ...initialState,
        mapStyles: [{ identifier: 'aaa', label: 'Aaa' }]
      });
    });
  });

  it('should set default table attributes', () => {
    expect(
      configReducer(
        {
          ...initialState,
          tableDefaultDefinitions: {}
        },
        ConfigActions.updateTableDefaultAttributes({
          definitions: { 'class-test': ['test'] }
        })
      )
    ).toEqual({
      ...initialState,
      tableDefaultDefinitions: { 'class-test': ['test'] }
    });
  });

  it('should set default tile attributes', () => {
    expect(
      configReducer(
        {
          ...initialState,
          tileDefinitions: {}
        },
        ConfigActions.updateTileAttributes({
          definitions: { 'class-test': ['test'] }
        })
      )
    ).toEqual({
      ...initialState,
      tileDefinitions: { 'class-test': ['test'] }
    });
  });

  it('should set colors available for named queries', () => {
    expect(
      configReducer(
        {
          ...initialState,
          availableColors: []
        },
        ConfigActions.defineColors({ colors: ['#FFFFFF', '#000000'] })
      )
    ).toEqual({
      ...initialState,
      availableColors: ['#FFFFFF', '#000000']
    });
  });

  describe('overlay', () => {
    it('should add overlay id to overlayList on open', () => {
      expect(
        configReducer(
          {
            ...initialState,
            overlayList: []
          },
          ConfigActions.addingOverlay({ id: 'overlay-id' })
        )
      ).toEqual({
        ...initialState,
        overlayList: ['overlay-id']
      });
    });
    it('should remove overlay id from overlayList on close', () => {
      expect(
        configReducer(
          {
            ...initialState,
            overlayList: ['overlay-id', 'overlay-id-2', 'overlay-id-3']
          },
          ConfigActions.closeOverlay({ id: 'overlay-id-2' })
        )
      ).toEqual({
        ...initialState,
        overlayList: ['overlay-id', 'overlay-id-3']
      });
    });
  });

  it('should set the breakpoint for desktop/mobile in px', () => {
    expect(
      configReducer(
        {
          ...initialState,
          breakpoint: 900
        },
        ConfigActions.defineBreakpoint({ breakpoint: 750 })
      )
    ).toEqual({
      ...initialState,
      breakpoint: 750
    });
  });

  it('should set the customization for icons/tooltip/table/tile definitions', () => {
    expect(
      configReducer(
        {
          ...initialState,
          iconDefinitions: {},
          tooltipDefinitions: {},
          tableDefaultDefinitions: {},
          tileDefinitions: {}
        },
        ConfigActions.loadedCustomization({
          icons: { 'class-test': [{ iconUrl: 'test.png', iconSize: [25, 25] }] },
          tooltips: { 'class-test': { type: 'default' } },
          filters: { 'class-test': { type: 'default' } },
          tableAttributes: { 'class-test': ['content'] },
          tileAttributes: { 'class-test': ['content'] }
        })
      )
    ).toEqual({
      ...initialState,
      iconDefinitions: { 'class-test': [{ iconUrl: 'test.png', iconSize: [25, 25] }] },
      tooltipDefinitions: { 'class-test': { type: 'default' } },
      filterDefinitions: { 'class-test': { type: 'default' } },
      tableDefaultDefinitions: { 'class-test': ['content'] },
      tileDefinitions: { 'class-test': ['content'] }
    });
  });

  describe('widget catalog', () => {
    it('should save widget', () => {
      expect(
        configReducer(
          {
            ...initialState,
            catalog: []
          },
          ConfigActions.saveWidget({
            widget: {
              id: 'e6fabb55-dd02-4632-94fa-09c04d1d7ac0',
              name: 'Restitution',
              description: '',
              content:
                '{"type":"tile","layout":{"x":1,"y":1,"width":1,"height":1},"options":{},"namedQuery":["39061554-298f-4f56-8cd2-51ccec998307"]}',
              image: 'internal:weather.png',
              visibility: { type: PryVisibilityType.PRIVATE, users: [] },
              datasource: [],
              modificationDate: ''
            }
          })
        )
      ).toEqual({
        ...initialState,
        catalog: [
          {
            id: 'e6fabb55-dd02-4632-94fa-09c04d1d7ac0',
            name: 'Restitution',
            description: '',
            content:
              '{"type":"tile","layout":{"x":1,"y":1,"width":1,"height":1},"options":{},"namedQuery":["39061554-298f-4f56-8cd2-51ccec998307"]}',
            image: 'internal:weather.png',
            visibility: { type: PryVisibilityType.PRIVATE, users: [] },
            datasource: [],
            modificationDate: ''
          }
        ]
      });
    });
    it('should have loaded widgets', () => {
      expect(
        configReducer(
          {
            ...initialState,
            catalog: []
          },
          ConfigActions.loadedWidgets({
            widgets: [
              {
                id: 'e6fabb55-dd02-4632-94fa-09c04d1d7ac0',
                name: 'Restitution',
                description: '',
                content:
                  '{"type":"tile","layout":{"x":1,"y":1,"width":1,"height":1},"options":{},"namedQuery":["39061554-298f-4f56-8cd2-51ccec998307"]}',
                image: 'internal:weather.png',
                visibility: { type: PryVisibilityType.PRIVATE, users: [] },
                datasource: [],
                modificationDate: ''
              }
            ]
          })
        )
      ).toEqual({
        ...initialState,
        catalog: [
          {
            id: 'e6fabb55-dd02-4632-94fa-09c04d1d7ac0',
            name: 'Restitution',
            description: '',
            content:
              '{"type":"tile","layout":{"x":1,"y":1,"width":1,"height":1},"options":{},"namedQuery":["39061554-298f-4f56-8cd2-51ccec998307"]}',
            image: 'internal:weather.png',
            visibility: { type: PryVisibilityType.PRIVATE, users: [] },
            datasource: [],
            modificationDate: ''
          }
        ]
      });
    });
  });

  describe('chart options', () => {
    it('should have loaded', () => {
      expect(
        configReducer(
          {
            ...initialState,
            chartOption: ChartOptionDefault
          },
          ConfigActions.loadedChartOption({
            chartOption: {
              type: [MarkType.ARC],
              subType: { arc: [MarkSubType.DONUT] },
              aggregation: [Aggregation.NONE],
              color: [VegaColorType.CATEGORY10, VegaColorType.CATEGORY20]
            }
          })
        )
      ).toEqual({
        ...initialState,
        chartOption: {
          type: [MarkType.ARC],
          subType: { arc: [MarkSubType.DONUT] },
          aggregation: [Aggregation.NONE],
          color: [VegaColorType.CATEGORY10, VegaColorType.CATEGORY20]
        }
      });
    });
    it('should update', () => {
      expect(
        configReducer(
          {
            ...initialState,
            chartOption: {
              type: [MarkType.ARC],
              subType: { arc: [MarkSubType.DONUT] },
              aggregation: [Aggregation.NONE],
              color: [VegaColorType.CATEGORY10, VegaColorType.CATEGORY20]
            }
          },
          ConfigActions.updateChartOption({
            chartOption: {
              type: [MarkType.BAR],
              subType: { bar: [MarkSubType.HISTOGRAM] }
            }
          })
        )
      ).toEqual({
        ...initialState,
        chartOption: {
          type: [MarkType.BAR],
          subType: { bar: [MarkSubType.HISTOGRAM] },
          aggregation: [Aggregation.NONE],
          color: [VegaColorType.CATEGORY10, VegaColorType.CATEGORY20]
        }
      });
    });
  });

  it('should update the maximum number of attributes displayed in tile widget', () => {
    expect(
      configReducer(
        {
          ...initialState,
          maxAttributesInTiles: 5
        },
        ConfigActions.updateMaxAttributesInTiles({ max: 2 })
      )
    ).toEqual({
      ...initialState,
      maxAttributesInTiles: 2
    });
  });

  describe('defineLimits', () => {
    it('should put limits in the store', () => {
      expect(
        configReducer(
          {
            ...initialState,
            limits: {}
          },
          ConfigActions.defineLimits({ limits: { dataset: 20 } })
        )
      ).toEqual({
        ...initialState,
        limits: {
          dataset: 20
        }
      });
    });
  });
});
