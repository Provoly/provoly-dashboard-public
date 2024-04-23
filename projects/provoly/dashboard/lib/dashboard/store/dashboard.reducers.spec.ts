import { Item } from '../../core/model/item.interface';
import { ManifestDescription } from '../../core/model/manifest.interface';
import { EXPLORE_NAMED_QUERY_ID } from '../../core/store/search/search.constants';
import { DashboardActions, DashboardCellParams } from './dashboard.actions';
import { dashboardInitialState, dashboardReducer } from './dashboard.reducers';

describe('Dashboard reducer', () => {
  const initialState = Object.assign({}, dashboardInitialState);

  describe('join', () => {
    it('should add self to tenants', () => {
      expect(
        dashboardReducer(
          { ...initialState, manifests: { ...initialState.manifests, tenants: ['a', 'b'] } },
          DashboardActions.join({ sender: 'c' })
        )
      ).toEqual({
        ...initialState,
        manifests: { ...initialState.manifests, tenants: ['a', 'b', 'c'] }
      });
    });
  });

  describe('leave', () => {
    it('should not remove leaver from tenants (done in effects)', () => {
      expect(
        dashboardReducer(
          { ...initialState, manifests: { ...initialState.manifests, tenants: ['a', 'b', 'c'] } },
          DashboardActions.leave({ sender: 'c' })
        )
      ).toEqual({
        ...initialState,
        manifests: { ...initialState.manifests, tenants: ['a', 'b', 'c'] }
      });
    });
  });

  describe('declareSenderId', () => {
    it('should init some state', () => {
      expect(
        dashboardReducer({ ...initialState }, DashboardActions.declareSenderId({ sender: 'me', tenants: ['not-me'] }))
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          sender: 'me',
          tenants: ['not-me']
        }
      });
    });
  });

  describe('setRefreshRate', () => {
    it('should set refresh rate for datasource', () => {
      expect(
        dashboardReducer({ ...initialState }, DashboardActions.setRefreshRate({ id: 'fakeid', rate: 30 }))
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          manifest: {
            ...initialState.manifests.manifest,
            refreshRates: { fakeid: 30 }
          }
        }
      });
    });
  });

  describe('updateManifest', () => {
    it('should input received manifest into store', () => {
      const manifest = { windows: [{ widgets: [{ type: 'no', layout: { x: 1, y: 2, height: 30, width: 50 } }] }] };
      expect(
        dashboardReducer(
          { ...initialState },
          DashboardActions.updateManifest({ manifest, tenants: ['me', 'another'], selectedIds: [] })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          manifest,
          tenants: ['me', 'another']
        }
      });
    });

    it('should input not received manifest into store if sender unknown', () => {
      const manifest = { windows: [{ widgets: [{ type: 'no', layout: { x: 1, y: 2, height: 30, width: 50 } }] }] };
      expect(
        dashboardReducer(
          { ...initialState, manifests: { ...initialState.manifests, tenants: ['me', 'known'] } },
          // @ts-ignore
          DashboardActions.updateManifest({ manifest, sender: 'unknown' })
        )
      ).toEqual({
        ...initialState,
        manifests: { ...initialState.manifests, tenants: ['me', 'known'] }
      });
    });

    it('should input received manifest into store if sender unknown, but is a joining request', () => {
      const manifest = { windows: [{ widgets: [{ type: 'no', layout: { x: 1, y: 2, height: 30, width: 50 } }] }] };
      expect(
        dashboardReducer(
          { ...initialState, manifests: { ...initialState.manifests, tenants: ['me', 'known'] } },
          DashboardActions.updateManifest({
            manifest,
            // @ts-ignore
            sender: 'unknown',
            joining: true,
            selectedIds: []
          })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          tenants: ['me', 'known'],
          manifest
        }
      });
    });
  });

  describe('clearManifest', () => {
    it('should clear current manifest', () => {
      expect(dashboardReducer({ ...initialState }, DashboardActions.clearManifest())).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          manifest: {
            windows: [
              {
                widgets: []
              }
            ],
            filters: []
          }
        }
      });
    });
  });

  describe('updateDashboardManifest', () => {
    it('should input received manifest into store', () => {
      const layout = { x: 1, y: 2, height: 30, width: 50 };
      const manifest = { widgets: [{ type: 'B', layout }] };
      expect(
        dashboardReducer(
          {
            ...initialState,
            manifests: {
              ...initialState.manifests,
              sender: 'me',
              tenants: ['other', 'me', 'another'],
              manifest: {
                windows: [
                  { widgets: [{ type: 'a', layout }] },
                  { widgets: [{ type: 'b', layout }] },
                  { widgets: [{ type: 'c', layout }] }
                ]
              }
            }
          },
          DashboardActions.updateDashboardManifest({ manifest })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          sender: 'me',
          tenants: ['other', 'me', 'another'],
          manifest: {
            windows: [
              { widgets: [{ type: 'a', layout }] },
              { widgets: [{ type: 'B', layout }] },
              { widgets: [{ type: 'c', layout }] }
            ]
          }
        }
      });
    });
  });

  describe('updateWidgetManifest', () => {
    it('should input received manifest into store', () => {
      const layout = { x: 1, y: 2, height: 30, width: 50 };
      const manifest = { type: 'B', layout };
      expect(
        dashboardReducer(
          {
            ...initialState,
            manifests: {
              ...initialState.manifests,
              sender: 'me',
              tenants: ['me'],
              manifest: {
                windows: [
                  {
                    widgets: [
                      { type: 'a', layout },
                      { type: 'b', layout },
                      { type: 'c', layout }
                    ]
                  }
                ]
              }
            }
          },
          DashboardActions.updateWidgetManifest({ manifest, index: 1 })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          ...initialState.manifests,
          sender: 'me',
          tenants: ['me'],
          manifest: {
            windows: [
              {
                widgets: [
                  { type: 'a', layout },
                  { type: 'B', layout },
                  { type: 'c', layout }
                ]
              }
            ]
          }
        }
      });
    });
  });

  describe('updateRouteManifest', () => {
    it('should update route of manifest according to sender', () => {
      const initial = {
        ...initialState,
        manifests: {
          ...initialState.manifests,
          manifest: {
            windows: [
              { route: 'a', widgets: [] },
              { route: 'b', widgets: [] },
              { route: 'me-route', widgets: [] },
              { route: 'd', widgets: [] }
            ]
          },
          tenants: ['other', 'another', 'me', 'again']
        }
      };
      expect(
        dashboardReducer(initial, DashboardActions.updateRouteManifest({ route: 'me-new-route', sender: 'me' }))
      ).toEqual({
        ...initial,
        manifests: {
          ...initial.manifests,
          manifest: {
            windows: [
              { route: 'a', widgets: [] },
              { route: 'b', widgets: [] },
              { route: 'me-new-route', widgets: [] },
              { route: 'd', widgets: [] }
            ]
          }
        }
      });
    });
  });

  describe('fetchManifest', () => {
    it('should not change state', () => {
      expect(dashboardReducer({ ...initialState }, DashboardActions.loadAndActivateManifest({ id: '3' }))).toEqual({
        ...initialState
      });
    });
  });

  describe('updateResultSet', () => {
    it('should input resultset into store', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            results: {
              ...initialState.results,
              resultSets: {}
            }
          },
          DashboardActions.updateResultSet({ id: 'rs', resultSet: { items: { a: [], b: [] }, relations: [] } })
        )
      ).toEqual({
        ...initialState,
        results: {
          ...initialState.results,
          resultSets: { rs: { items: { a: [], b: [] }, relations: [] } }
        }
      });
    });
  });

  describe('moveWidget', () => {
    it('should move widget from window to another into store', () => {
      const layout = { x: 1, y: 2, height: 30, width: 50 };
      const manifest = { type: 'B', layout };
      expect(
        dashboardReducer(
          {
            ...initialState,
            manifests: {
              ...initialState.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b', 'c'],
              manifest: {
                windows: [
                  { route: 'a', widgets: [] },
                  { route: 'b', widgets: [{ type: 'A', layout }, manifest, { type: 'C', layout }] },
                  { route: 'c', widgets: [] },
                  { route: 'd', widgets: [] }
                ]
              }
            }
          },
          DashboardActions.moveWidget({ widgetIndex: 1, targetIndex: 3 })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          sender: 'me',
          tenants: ['a', 'me', 'b', 'c'],
          manifest: {
            windows: [
              { route: 'a', widgets: [] },
              {
                route: 'b',
                widgets: [
                  { type: 'A', layout },
                  { type: 'C', layout }
                ]
              },
              { route: 'c', widgets: [] },
              { route: 'd', widgets: [manifest] }
            ]
          }
        }
      });
    });

    it('should move widget from window to a new one into store', () => {
      const layout = { x: 1, y: 2, height: 30, width: 50 };
      const manifest = { type: 'B', layout };
      expect(
        dashboardReducer(
          {
            ...initialState,
            manifests: {
              ...initialState.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b', 'c'],
              manifest: {
                windows: [
                  { route: 'a', widgets: [] },
                  { route: 'b', widgets: [{ type: 'A', layout }, manifest, { type: 'C', layout }] },
                  { route: 'c', widgets: [] },
                  { route: 'd', widgets: [] }
                ]
              }
            }
          },
          DashboardActions.moveWidget({ widgetIndex: 1, targetIndex: -1 })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          sender: 'me',
          tenants: ['a', 'me', 'b', 'c'],
          manifest: {
            windows: [
              { route: 'a', widgets: [] },
              {
                route: 'b',
                widgets: [
                  { type: 'A', layout },
                  { type: 'C', layout }
                ]
              },
              { route: 'c', widgets: [] },
              { route: 'd', widgets: [] },
              { route: 'b', widgets: [manifest] }
            ]
          }
        }
      });
    });

    it('should move widget from window to even a non existing window into store', () => {
      const layout = { x: 1, y: 2, height: 30, width: 50 };
      const manifest = { type: 'B', layout };
      expect(
        dashboardReducer(
          {
            ...initialState,
            manifests: {
              ...initialState.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b', 'c'],
              manifest: {
                windows: [
                  // @ts-ignore
                  undefined,
                  { route: 'b', widgets: [{ type: 'A', layout }, manifest, { type: 'C', layout }] },
                  { route: 'c', widgets: [] },
                  { route: 'd', widgets: [] }
                ]
              }
            }
          },
          DashboardActions.moveWidget({ widgetIndex: 1, targetIndex: 0 })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          sender: 'me',
          tenants: ['a', 'me', 'b', 'c'],
          manifest: {
            windows: [
              { route: 'b', widgets: [manifest] },
              {
                route: 'b',
                widgets: [
                  { type: 'A', layout },
                  { type: 'C', layout }
                ]
              },
              { route: 'c', widgets: [] },
              { route: 'd', widgets: [] }
            ]
          }
        }
      });
    });
  });

  describe('maximizeWidget', () => {
    it('should change widget layout', () => {
      const layout = { x: 1, y: 2, height: 2, width: 3 };
      const manifest = { type: 'B', layout };
      expect(
        dashboardReducer(
          {
            ...initialState,
            manifests: {
              ...initialState.manifests,
              sender: 'me',
              tenants: ['a', 'me', 'b', 'c'],
              manifest: {
                windows: [
                  { route: 'a', widgets: [] },
                  { route: 'b', widgets: [{ type: 'A', layout }, manifest, { type: 'C', layout }] },
                  { route: 'c', widgets: [] },
                  { route: 'd', widgets: [] }
                ]
              }
            },
            dashboard: {
              ...initialState.dashboard,
              params: {
                ...initialState.dashboard.params,
                rows: 18,
                columns: 24
              }
            }
          },
          DashboardActions.maximizeWidget({ widgetIndex: 1 })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          sender: 'me',
          tenants: ['a', 'me', 'b', 'c'],
          manifest: {
            windows: [
              { route: 'a', widgets: [] },
              {
                route: 'b',
                widgets: [
                  { type: 'A', layout },
                  { type: 'B', layout: { x: 1, y: 1, width: 24, height: 18 } },
                  { type: 'C', layout }
                ]
              },
              { route: 'c', widgets: [] },
              { route: 'd', widgets: [] }
            ]
          }
        },
        dashboard: {
          ...initialState.dashboard,
          params: {
            ...initialState.dashboard.params,
            rows: 18,
            columns: 24
          }
        }
      });
    });
  });

  describe('setAvailableResultSets', () => {
    it('should input available RS into store', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            results: {
              ...initialState.results,
              availableDatasourceNames: ['a', 'b'],
              defaultDatasource: []
            }
          },
          DashboardActions.setDefaultDatasource({ names: [] })
        )
      ).toEqual({
        ...initialState,
        results: {
          ...initialState.results,
          availableDatasourceNames: ['a', 'b'],
          defaultDatasource: []
        }
      });
    });
  });

  describe('setCurrentResultSet', () => {
    it('should change current RS into store', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            results: {
              ...initialState.results,
              defaultDatasource: ['current']
            }
          },
          DashboardActions.setDefaultDatasource({ names: ['another'] })
        )
      ).toEqual({
        ...initialState,
        results: {
          ...initialState.results,
          defaultDatasource: ['another']
        }
      });
    });
  });

  describe('updateDashboardParams', () => {
    it('should store params into store', () => {
      const params = { cellHeight: 3 } as DashboardCellParams;
      expect(
        dashboardReducer(
          {
            ...initialState,
            dashboard: {
              ...initialState.dashboard,
              params: {
                ...initialState.dashboard.params,
                cellHeight: 0
              }
            }
          },
          DashboardActions.updateDashboardParams({ params })
        )
      ).toEqual({
        ...initialState,
        dashboard: {
          ...initialState.dashboard,
          params: {
            ...initialState.dashboard.params,
            ...params
          }
        }
      });
    });
  });

  describe('toggleEditionMode', () => {
    it('should store mode into store', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            dashboard: {
              ...initialState.dashboard,
              editionMode: true
            }
          },
          DashboardActions.toggleEditionMode({})
        )
      ).toEqual({
        ...initialState,
        dashboard: {
          ...initialState.dashboard,
          editionMode: false
        }
      });
    });
  });

  describe('select', () => {
    it('should store item non cumulative way into store', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            results: {
              ...initialState.results,
              selectedItems: ['selected', 'also-selected']
            }
          },
          DashboardActions.select({ cumulative: false, id: 'only-selected' })
        )
      ).toEqual({
        ...initialState,
        results: {
          ...initialState.results,
          selectedItems: ['only-selected']
        }
      });
    });
  });

  it('should store item cumulative way into store', () => {
    expect(
      dashboardReducer(
        {
          ...initialState,
          results: {
            ...initialState.results,
            selectedItems: ['selected', 'also-selected']
          }
        },
        DashboardActions.select({ cumulative: true, id: 'added-selected' })
      )
    ).toEqual({
      ...initialState,
      results: {
        ...initialState.results,
        selectedItems: ['selected', 'also-selected', 'added-selected']
      }
    });
  });

  it('should store unique item only', () => {
    expect(
      dashboardReducer(
        {
          ...initialState,
          results: {
            ...initialState.results,
            selectedItems: []
          }
        },
        DashboardActions.selectMany({ ids: ['selected', 'selected'] })
      )
    ).toEqual({
      ...initialState,
      results: {
        ...initialState.results,
        selectedItems: ['selected']
      }
    });
  });

  describe('select', () => {
    it('should be able to invert selection', () => {
      const rs = {
        a: {
          items: {
            aaa: [
              { id: 'a', oClass: 'aaa', attributes: {} },
              { id: 'selected', oClass: 'aaa', attributes: {} }
            ]
          },
          relations: []
        },
        b: {
          items: {
            bbb: [
              { id: 'a', oClass: 'bbb', attributes: {} },
              { id: 'b', oClass: 'bbb', attributes: {} },
              { id: 'also-selected', oClass: 'bbb', attributes: {} }
            ],
            ccc: [
              { id: 'c', oClass: 'ccc', attributes: {} },
              { id: 'third-selected', oClass: 'ccc', attributes: {} }
            ]
          },
          relations: []
        }
      };

      expect(
        dashboardReducer(
          {
            ...initialState,
            results: {
              ...initialState.results,
              resultSets: rs,
              selectedItems: ['selected', 'also-selected', 'third-selected']
            }
          },
          DashboardActions.invertSelection()
        )
      ).toEqual({
        ...initialState,
        results: {
          ...initialState.results,
          resultSets: rs,
          selectedItems: ['a', 'b', 'c']
        }
      });
    });
  });

  it('should remove item cumulative way into store if already present', () => {
    expect(
      dashboardReducer(
        {
          ...initialState,
          results: {
            ...initialState.results,
            selectedItems: ['selected', 'also-selected']
          }
        },
        DashboardActions.select({ cumulative: true, id: 'also-selected' })
      )
    ).toEqual({
      ...initialState,
      results: {
        ...initialState.results,
        selectedItems: ['selected']
      }
    });
  });

  describe('updateListManifests', () => {
    it('should store mode into store', () => {
      expect(
        dashboardReducer(
          {
            ...initialState
          },
          DashboardActions.updateManifestsList({
            manifests: [
              { name: 'a', manifestUrl: 'http://a' },
              { name: 'b', manifestUrl: 'http://b' }
            ] as ManifestDescription[]
          })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          list: [
            { name: 'a', manifestUrl: 'http://a' },
            { name: 'b', manifestUrl: 'http://b' }
          ]
        }
      });
    });
  });

  describe('updateStaticManifests', () => {
    it('should input received staticManifest into store', () => {
      const manifest = { windows: [{ widgets: [{ type: 'no', layout: { x: 1, y: 2, height: 30, width: 50 } }] }] };
      expect(
        dashboardReducer(
          {
            ...initialState
          },
          DashboardActions.updateStaticManifest({
            staticManifest: manifest
          })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          staticManifest: manifest
        }
      });
    });
  });

  describe('updateObjectsDetails', () => {
    it('should store details into store', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            results: {
              ...initialState.results,
              objectDetails: {
                ccc: { id: 'ccc' } as Item
              }
            }
          },
          DashboardActions.updateObjectsDetails({
            list: {
              aaa: { id: 'aaa' } as Item,
              bbb: { id: 'bbb' } as Item
            }
          })
        )
      ).toEqual({
        ...initialState,
        results: {
          ...initialState.results,
          objectDetails: {
            aaa: { id: 'aaa' } as Item,
            bbb: { id: 'bbb' } as Item,
            ccc: { id: 'ccc' } as Item
          }
        }
      });
    });
  });

  describe('explore', () => {
    it('should isolate into an explore resultset', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            results: {
              ...initialState.results,
              resultSets: {
                ...initialState.results.resultSets,
                test: {
                  items: {
                    classA: [{ id: 'aaa', oClass: 'classA', attributes: {} }],
                    classB: [{ id: 'bbb', oClass: 'classB', attributes: {} }]
                  },
                  relations: []
                }
              }
            }
          },
          DashboardActions.explore({ id: 'bbb' })
        )
      ).toEqual({
        ...initialState,
        manifests: {
          ...initialState.manifests,
          manifest: {
            ...initialState.manifests.manifest,
            windows: [
              ...initialState.manifests.manifest.windows,
              {
                widgets: [
                  {
                    layout: { x: 1, y: 1, width: 12, height: 12 },
                    datasource: EXPLORE_NAMED_QUERY_ID,
                    options: {},
                    type: 'graph'
                  }
                ]
              }
            ]
          }
        },
        results: {
          ...initialState.results,
          resultSets: {
            ...initialState.results.resultSets,
            test: {
              items: {
                classA: [{ id: 'aaa', oClass: 'classA', attributes: {} }],
                classB: [{ id: 'bbb', oClass: 'classB', attributes: {} }]
              },
              relations: []
            },
            [EXPLORE_NAMED_QUERY_ID]: {
              items: { classB: [{ id: 'bbb', oClass: 'classB', attributes: {} }] },
              relations: []
            }
          }
        }
      });
    });
  });

  describe('getWmsFeatures', () => {
    it('should clear actual features', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            wmsFeatures: { '0': [{ something: true }] }
          },
          DashboardActions.getWmsFeatures({
            url: 'http://',
            oClass: 'a',
            componentId: '0',
            coordinates: [0, 0]
          })
        )
      ).toEqual({
        ...initialState,
        wmsFeatures: {}
      });
    });
  });

  describe('addWmsFeatures', () => {
    it('should not clear actual features', () => {
      expect(
        dashboardReducer(
          {
            ...initialState,
            wmsFeatures: { '0': [{ id: 1, something: true }] }
          },
          DashboardActions.addWmsFeatures({
            features: [
              { id: 2, alsoSomething: true },
              { id: 3, alsoAnotherSomething: true },
              { id: 3, alsoAnotherSomethingWithSameId: true }
            ],
            componentId: '0'
          })
        )
      ).toEqual({
        ...initialState,
        wmsFeatures: {
          '0': [
            { id: 1, something: true },
            { id: 2, alsoSomething: true },
            { id: 3, alsoAnotherSomething: true }
          ]
        }
      });
    });
  });
});
