import { DashboardManifest, ManifestDescription } from '../../core/model/manifest.interface';
import { dashboardInitialState, DashboardState } from './dashboard.reducers';
import { DashboardSelectors } from './dashboard.selectors';

const buildState = (state: Partial<DashboardState>) =>
  Object.assign(
    {},
    { '@pry/dashboard': JSON.parse(JSON.stringify({ ...dashboardInitialState, ...state })) as DashboardState }
  );

const initial = buildState({})['@pry/dashboard'];

describe('Dashboard selectors', () => {
  describe('rank', () => {
    it('should default to no rank', () => {
      expect(DashboardSelectors.rank(buildState({}))).toEqual(-1);
    });

    it('should give my rank amongst tenants', () => {
      expect(
        DashboardSelectors.rank(
          buildState({
            manifests: {
              ...initial.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b']
            }
          })
        )
      ).toEqual(1);
    });
  });

  describe('globalManifest', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.globalManifest(buildState({}))).toEqual({ windows: [{ widgets: [] }] });
    });

    it('should answer global manifest', () => {
      expect(
        DashboardSelectors.globalManifest(
          buildState({
            manifests: {
              ...initial.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b'],
              manifest: {
                windows: [
                  { route: 'a', widgets: [] },
                  { route: 'me', widgets: [] },
                  { route: 'b', widgets: [] }
                ]
              }
            }
          })
        )
      ).toEqual({
        windows: [
          { route: 'a', widgets: [] },
          { route: 'me', widgets: [] },
          { route: 'b', widgets: [] }
        ]
      });
    });
  });

  describe('staticManifest', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.staticManifest(buildState({}))).toEqual({ windows: [{ widgets: [] }] });
    });

    it('should answer static manifest', () => {
      expect(
        DashboardSelectors.staticManifest(
          buildState({
            manifests: {
              ...initial.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b'],
              staticManifest: {
                windows: [
                  { route: 'a', widgets: [] },
                  { route: 'me', widgets: [] },
                  { route: 'b', widgets: [] }
                ]
              }
            }
          })
        )
      ).toEqual({
        windows: [
          { route: 'a', widgets: [] },
          { route: 'me', widgets: [] },
          { route: 'b', widgets: [] }
        ]
      });
    });
  });

  describe('windowManifest', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.windowManifest(buildState({}))).toEqual({ widgets: [] });
    });

    it('should answer my window manifest', () => {
      expect(
        DashboardSelectors.windowManifest(
          buildState({
            manifests: {
              ...initial.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b'],
              manifest: {
                windows: [
                  { route: 'a', widgets: [] },
                  { route: 'me', widgets: [] },
                  { route: 'b', widgets: [] }
                ]
              }
            }
          })
        )
      ).toEqual({ route: 'me', widgets: [] });
    });
  });

  describe('widgetManifest', () => {
    it('should default to simple placeholder manifest', () => {
      expect(DashboardSelectors.widgetManifest(0)(buildState({}) as unknown as DashboardManifest)).toEqual({
        layout: {
          height: 1,
          width: 1,
          x: 1,
          y: 1
        },
        type: 'placeholder'
      });
    });

    it('should answer my window manifest', () => {
      expect(
        DashboardSelectors.widgetManifest(1)(
          buildState({
            ...initial,
            manifests: {
              ...initial.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b'],
              manifest: {
                windows: [
                  { route: 'a', widgets: [] },
                  {
                    route: 'me',
                    widgets: [
                      { type: 'a', layout: { x: 1, y: 1, width: 2, height: 2 } },
                      {
                        type: 'thisone',
                        layout: { x: 1, y: 1, width: 2, height: 2 }
                      },
                      { type: 'c', layout: { x: 1, y: 1, width: 2, height: 2 } }
                    ]
                  },
                  { route: 'b', widgets: [] }
                ]
              }
            }
          }) as unknown as DashboardManifest
        )
      ).toEqual({
        type: 'thisone',
        layout: { x: 1, y: 1, width: 2, height: 2 }
      });
    });
  });

  describe('targetTenantsIndexes', () => {
    it('should default to new target only', () => {
      expect(DashboardSelectors.targetTenantsIndexes(buildState({}))).toEqual([-1]);
    });

    it('should answer ranks eligible as targets (not me)', () => {
      expect(
        DashboardSelectors.targetTenantsIndexes(
          buildState({
            manifests: {
              ...initial.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b']
            }
          })
        )
      ).toEqual([-1, 0, 2]);
    });
  });

  describe('availableResultSets', () => {
    it('should be unique available and present resultsets', () => {
      expect(
        DashboardSelectors.availableNamedQueries(
          buildState({
            results: {
              ...initial.results,
              availableDatasourceNames: ['a', 'b'],
              resultSets: {
                a: { items: {}, relations: [] },
                c: { items: {}, relations: [] }
              }
            }
          })
        )
      ).toEqual(['a', 'b', 'c']);
    });
  });

  describe('currentResultSetName', () => {
    it('should default to current', () => {
      expect(DashboardSelectors.defaultDatasourceNames(buildState({}))).toEqual(['current']);
    });

    it('should give current resultSetName', () => {
      expect(
        DashboardSelectors.defaultDatasourceNames(
          buildState({
            results: {
              ...initial.results,
              defaultDatasource: ['real-current']
            }
          })
        )
      ).toEqual(['real-current']);
    });
  });

  describe('dashboardEditionMode', () => {
    it('should default to false', () => {
      expect(DashboardSelectors.dashboardEditionMode(buildState({}))).toEqual(false);
    });

    it('should give icon definitions', () => {
      expect(
        DashboardSelectors.dashboardEditionMode(
          buildState({
            dashboard: {
              ...initial.dashboard,
              editionMode: true
            }
          })
        )
      ).toEqual(true);
    });
  });

  describe('selectedItemsName', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.selectedItemIds(buildState({}))).toEqual([]);
    });

    it('should give selected item Names', () => {
      expect(
        DashboardSelectors.selectedItemIds(
          buildState({
            results: {
              ...initial.results,
              selectedItems: ['selected', 'other-selected', 'and-another']
            }
          })
        )
      ).toEqual(['selected', 'other-selected', 'and-another']);
    });
  });

  describe('selectedItems', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.selectedItems(buildState({}))).toEqual([]);
    });

    it('should give selected items', () => {
      expect(
        DashboardSelectors.selectedItems(
          buildState({
            results: {
              ...initial.results,
              selectedItems: ['selected', 'other-selected', 'and-another', 'and-last'],
              resultSets: {
                a: {
                  items: {
                    a: [
                      { id: 'selected', oClass: 'a', attributes: {} },
                      {
                        id: 'not-selected',
                        oClass: 'a',
                        attributes: {}
                      },
                      { id: 'other-selected', oClass: 'a', attributes: {} }
                    ],
                    b: [
                      { id: 'and-last', oClass: 'b', attributes: {} },
                      {
                        id: 'another-not-selected',
                        oClass: 'b',
                        attributes: {}
                      }
                    ]
                  },
                  relations: []
                },
                b: {
                  items: {
                    b: [
                      { id: 'selected', oClass: 'b', attributes: {} },
                      {
                        id: 'and-another',
                        oClass: 'b',
                        attributes: {}
                      },
                      { id: 'other-selected', oClass: 'b', attributes: {} }
                    ]
                  },
                  relations: []
                }
              }
            }
          })
        )
      ).toEqual([
        { id: 'selected', oClass: 'a', attributes: {} },
        {
          id: 'other-selected',
          oClass: 'a',
          attributes: {}
        },
        { id: 'and-another', oClass: 'b', attributes: {} },
        { id: 'and-last', oClass: 'b', attributes: {} }
      ]);
    });
  });

  describe('resultSetUses', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.namedQueriesUses(buildState({}))).toEqual({});
    });

    it('should return correct uses of resultset in manifest', () => {
      expect(
        DashboardSelectors.namedQueriesUses(
          buildState({
            manifests: {
              ...initial.manifests,
              manifest: {
                windows: [
                  {
                    grid: { rows: 5 },
                    widgets: [
                      {
                        type: 'table',
                        layout: { x: 1, y: 1, height: 12, width: 8 },
                        options: {},
                        datasource: 'search'
                      },
                      {
                        type: 'detail',
                        layout: { x: 9, y: 1, height: 12, width: 4 },
                        options: { itemIds: ['528'] }
                      }
                    ],
                    route: '/map'
                  },
                  {
                    widgets: [
                      {
                        type: 'map',
                        layout: { x: 1, y: 2, height: 2, width: 3 },
                        options: { style: 'osm-bright', fit: true, layers: [{ type: 'heatmap' }] },
                        datasource: 'rs1'
                      },
                      {
                        type: 'map',
                        layout: { x: 3, y: 4, height: 2, width: 3 },
                        options: { style: 'osm-bright', fit: true, layers: [{ type: 'heatmap' }] },
                        datasource: 'rs5'
                      },
                      {
                        type: 'map',
                        layout: { x: 3, y: 4, height: 2, width: 3 },
                        options: { style: 'osm-bright', fit: true, layers: [{ type: 'heatmap' }] },
                        datasource: 'search'
                      }
                    ],
                    route: '/search'
                  }
                ]
              }
            }
          })
        )
      ).toEqual({
        rs1: [
          {
            layout: {
              height: 2,
              width: 3,
              x: 1,
              y: 2
            },
            rsName: 'rs1',
            type: 'map',
            windowIndex: 1
          }
        ],
        rs5: [
          {
            layout: {
              height: 2,
              width: 3,
              x: 3,
              y: 4
            },
            rsName: 'rs5',
            type: 'map',
            windowIndex: 1
          }
        ],
        search: [
          {
            layout: {
              height: 12,
              width: 8,
              x: 1,
              y: 1
            },
            rsName: 'search',
            type: 'table',
            windowIndex: 0
          },
          {
            layout: {
              height: 2,
              width: 3,
              x: 3,
              y: 4
            },
            rsName: 'search',
            type: 'map',
            windowIndex: 1
          }
        ]
      });
    });
  });

  describe('dashboardEditionMode', () => {
    it('should give icon definitions', () => {
      expect(
        DashboardSelectors.dashboardEditionMode(
          buildState({
            dashboard: {
              ...initial.dashboard,
              editionMode: true
            }
          })
        )
      ).toEqual(true);
    });
  });

  describe('listManifest', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.manifestsList(buildState({}))).toEqual([]);
    });

    it('should give list of manifests', () => {
      expect(
        DashboardSelectors.manifestsList(
          buildState({
            manifests: {
              ...initial.manifests,
              list: [
                { name: 'a', manifestUrl: 'http://a' } as ManifestDescription,
                { name: 'b', manifestUrl: 'http://b' } as ManifestDescription
              ]
            }
          })
        )
      ).toEqual([
        { name: 'a', manifestUrl: 'http://a' },
        { name: 'b', manifestUrl: 'http://b' }
      ]);
    });
  });

  describe('currentManifestId', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.currentManifestId(buildState({}))).toEqual('');
    });

    it('should give current mainfest Id', () => {
      expect(
        DashboardSelectors.currentManifestId(
          buildState({
            manifests: {
              ...initial.manifests,
              currentId: 'toto'
            }
          })
        )
      ).toEqual('toto');
    });
  });

  describe('objectDetails', () => {
    it('should default to empty', () => {
      expect(DashboardSelectors.objectDetails(buildState({}))).toEqual({});
    });

    it('should give object details', () => {
      expect(
        DashboardSelectors.objectDetails(
          buildState({
            results: {
              ...initial.results,
              objectDetails: { toto: { id: 'toto', oClass: 'a', attributes: {} } }
            }
          })
        )
      ).toEqual({ toto: { id: 'toto', oClass: 'a', attributes: {} } });
    });
  });
});
