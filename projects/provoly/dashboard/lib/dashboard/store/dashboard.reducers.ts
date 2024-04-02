import { Action, createReducer, on } from '@ngrx/store';
import { DisplayOptions, getDisplayOptions } from '../../core/model/display-options.interface';
import { Filter } from '../../core/model/filter.interface';
import { Item } from '../../core/model/item.interface';
import {
  DashboardGridLayout,
  GlobalManifest,
  ManifestDescription,
  WidgetManifest
} from '../../core/model/manifest.interface';
import { Relation } from '../../core/model/relation.interface';
import { ResultOrder } from '../../core/model/result-order.interface';
import { ResultSets } from '../../core/model/result-set.interface';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from '../../core/store/search/search.constants';
import { solveCollisions } from '../components/solve-collisions.function';
import { WidgetPlacementUtils } from '../components/widgets/widget-placement/widget-placement.utils';
import { DashboardActions, DashboardCellParams, ViewMode } from './dashboard.actions';
import {
  DEFAULT_COLUMNS_NUMBER,
  DEFAULT_GAP_PX,
  DEFAULT_ROW_HEIGHT_PX,
  DEFAULT_ROWS_NUMBER
} from './dashboard.contants';
import { GetCapabilitiesResponse } from './wms.service';
import { MapWidgetOptions } from '../../core/model/widget-map-manifest.interface';

export const dashboardFeatureKey = '@pry/dashboard';

export interface DashboardState {
  manifests: {
    sender: string;
    tenants: string[];
    manifest: GlobalManifest;
    list: ManifestDescription[];
    currentId: string;
    staticManifest: GlobalManifest;
    loading: boolean;
  };
  presentation: {
    current: ManifestDescription | undefined;
    viewMode?: ViewMode;
    initial: GlobalManifest | undefined;
  };
  results: {
    resultSets: ResultSets;
    resultSetsParams: { [id: string]: string | undefined };
    availableDatasourceNames: string[];
    defaultDatasource: string[];
    selectedItems: string[];
    objectDetails: { [id: string]: Item };
    quickOrder: { [id: string]: ResultOrder | undefined };
  };
  dashboard: {
    params: DashboardCellParams;
    editionMode: boolean;
  };
  wmsFeatures: any[];
  display?: DisplayOptions;
  capabilities: { [url: string]: GetCapabilitiesResponse | null };
}

export const dashboardInitialState: DashboardState = {
  manifests: {
    sender: '',
    tenants: [],
    manifest: {
      windows: [{ widgets: [] }]
    },
    staticManifest: {
      windows: [{ widgets: [] }]
    },
    list: [],
    currentId: '',
    loading: false
  },
  presentation: {
    current: undefined,
    initial: undefined
  },
  results: {
    availableDatasourceNames: [],
    resultSets: {
      [DEFAULT_NAMED_QUERY_ID]: { items: {}, relations: [] },
      [EXPLORE_NAMED_QUERY_ID]: { items: {}, relations: [] }
    },
    resultSetsParams: {
      [DEFAULT_NAMED_QUERY_ID]: undefined,
      [EXPLORE_NAMED_QUERY_ID]: undefined
    },
    defaultDatasource: ['current'],
    selectedItems: [],
    objectDetails: {},
    quickOrder: {}
  },
  dashboard: {
    params: {
      gridWidth: 1,
      gridHeight: 1,
      gridGap: DEFAULT_GAP_PX,
      columns: DEFAULT_COLUMNS_NUMBER,
      cellHeight: DEFAULT_ROW_HEIGHT_PX,
      rows: DEFAULT_ROWS_NUMBER,
      cellWidth: 1,
      offsetLeft: 0,
      offsetTop: 0,
      mobileMode: false
    },
    editionMode: false
  },
  wmsFeatures: [],
  capabilities: {}
};

const internalReducer = createReducer<DashboardState>(
  dashboardInitialState,
  on(DashboardActions.join, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      tenants: [...state.manifests.tenants, action.sender]
    }
  })),
  on(DashboardActions.declareSenderId, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      sender: action.sender,
      tenants: state.manifests.tenants.length === 0 ? action.tenants : state.manifests.tenants
    }
  })),
  on(
    DashboardActions.updateManifest,
    DashboardActions.updateManifestAfterTenantJoin,
    DashboardActions.updateManifestAfterTenantLeave,
    DashboardActions.updateManifestAfterFetch,
    DashboardActions.updateManifestWithoutActivation,
    (state, action) => {
      // @ts-ignore
      if (!!action.sender && !state.manifests.tenants.find((tenant) => tenant === action.sender) && !action.joining) {
        // ignore manifest updates from tenants that have not joined
        return state;
      }
      return {
        ...state,
        manifests: {
          ...state.manifests,
          tenants: action.tenants ?? state.manifests.tenants,
          manifest: action.manifest,
          currentId: action.manifestId ?? state.manifests.currentId
        },
        // @ts-ignore
        presentation: action.presentation ?? state.presentation,
        results: {
          ...state.results,
          selectedItems: action.selectedIds,
          resultSets: !!action.resultSets
            ? { ...state.results.resultSets, ...action.resultSets }
            : state.results.resultSets
        },
        // @ts-ignore
        display: action.display ?? state.display
      };
    }
  ),
  on(DashboardActions.updateRouteManifest, (state, action) => {
    const senderRank = state.manifests.tenants.indexOf(action.sender ?? state.manifests.sender);
    const newWindows = [...state.manifests.manifest.windows];
    newWindows[senderRank] = { ...newWindows[senderRank], route: action.route };

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.updateDashboardManifest, (state, action) => {
    const myRank = state.manifests.tenants.indexOf(state.manifests.sender);
    const newWindows = [...state.manifests.manifest.windows];
    newWindows[myRank] = action.manifest;

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.updateWidgetManifest, (state, action) => {
    const myRank = state.manifests.tenants.indexOf(state.manifests.sender);
    const newWindows = JSON.parse(JSON.stringify(state.manifests.manifest.windows));
    (newWindows[myRank] ?? { widgets: [] }).widgets[action.index] = action.manifest;

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.updateResultSet, (state, action) => ({
    ...state,
    results: {
      ...state.results,
      resultSets: {
        ...state.results.resultSets,
        [action.id]: action.resultSet
      },
      resultSetsParams: {
        ...state.results.resultSetsParams,
        [action.id]: action.params
      }
    }
  })),
  on(DashboardActions.moveWidget, (state, action) => {
    const myRank = state.manifests.tenants.indexOf(state.manifests.sender);
    const newWindows = [...state.manifests.manifest.windows];

    // Creating new current window manifest, without moved widget
    const myNewWindow = {
      ...newWindows[myRank],
      widgets: [...newWindows[myRank].widgets]
    };
    const widget = myNewWindow.widgets.splice(action.widgetIndex, 1)[0];
    newWindows[myRank] = myNewWindow;

    // Creating either a new window manifest or update the target one
    const targetRank = action.targetIndex;
    if (targetRank !== -1) {
      if (!newWindows[targetRank]) {
        newWindows[targetRank] = {
          ...newWindows[myRank],
          widgets: [widget]
        };
      } else {
        newWindows[targetRank] = {
          ...newWindows[targetRank],
          widgets: [...(newWindows[targetRank].widgets ?? []), widget]
        };
      }
    } else {
      // create new window to welcome this widget
      newWindows.push({
        ...newWindows[myRank],
        widgets: [widget]
      });
    }

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.maximizeWidget, (state, action) => {
    const myRank = state.manifests.tenants.indexOf(state.manifests.sender);
    const newWindows = JSON.parse(JSON.stringify(state.manifests.manifest.windows));
    newWindows[myRank].widgets[action.widgetIndex].layout = {
      x: 1,
      y: 1,
      width: state.dashboard.params.columns,
      height: state.dashboard.params.rows
    };

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.setAvailableNamedQueries, (state, action) => ({
    ...state,
    results: {
      ...state.results,
      availableDatasourceNames: action.names,
      defaultDatasource: state.results.defaultDatasource.filter((rsName) => action.names.includes(rsName))
    }
  })),
  on(DashboardActions.setDefaultDatasource, (state, action) => ({
    ...state,
    results: {
      ...state.results,
      defaultDatasource: action.names
    }
  })),
  on(DashboardActions.solveCollisions, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        windows: state.manifests.manifest.windows.map((window) => {
          const [first, ...others] = window.widgets;
          return solveCollisions(first, others, window);
        })
      }
    }
  })),
  on(DashboardActions.updateDashboardParams, (state, action) => ({
    ...state,
    dashboard: {
      ...state.dashboard,
      params: {
        ...state.dashboard.params,
        ...action.params
      }
    }
  })),
  on(DashboardActions.toggleEditionMode, (state, action) => ({
    ...state,
    dashboard: {
      ...state.dashboard,
      editionMode: action.force ?? !state.dashboard.editionMode
    }
  })),
  on(DashboardActions.select, (state, action) => ({
    ...state,
    results: {
      ...state.results,
      selectedItems: [
        ...new Set(
          !action.cumulative
            ? [action.id]
            : state.results.selectedItems.find((id) => id === action.id)
              ? state.results.selectedItems.filter((id) => id !== action.id)
              : [...state.results.selectedItems, action.id]
        )
      ]
    }
  })),
  on(DashboardActions.invertSelection, (state, action) => {
    const allItems = Object.keys(state.results.resultSets)
      .map((rs) =>
        Object.keys(state.results.resultSets[rs].items)
          .map((classId) => state.results.resultSets[rs].items[classId] as Item[])
          .reduce((p, c) => [...p, ...c], [])
      )
      .reduce((p, c) => [...p, ...c], [])
      .map((item) => item.id);

    const invertedItemsId = allItems.filter((itemId) => !state.results.selectedItems.includes(itemId));

    return {
      ...state,
      results: {
        ...state.results,
        selectedItems: [...new Set(invertedItemsId)]
      }
    };
  }),
  on(DashboardActions.selectMany, (state, action) => ({
    ...state,
    results: {
      ...state.results,
      selectedItems: [...new Set(action.ids)]
    }
  })),
  on(DashboardActions.updateManifestsList, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      list: action.manifests
    },
    presentation: {
      ...state.presentation,
      current: !!state.presentation.current
        ? action.manifests.find((manifest) => manifest.id === state.presentation.current?.id) ??
          state.presentation.current
        : undefined
    }
  })),
  on(DashboardActions.updateStaticManifest, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      staticManifest: action.staticManifest
    }
  })),
  on(DashboardActions.loadAndActivateManifest, DashboardActions.loadManifest, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        windows: [...state.manifests.manifest.windows.map((winManifest) => ({ ...winManifest, widgets: [] }))]
      }
    }
  })),
  on(DashboardActions.clearManifest, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        windows: [...state.manifests.manifest.windows.map((previous) => ({ ...previous, widgets: [] }))],
        filters: []
      },
      currentId: ''
    }
  })),
  on(DashboardActions.updateObjectsDetails, (state, action) => ({
    ...state,
    results: {
      ...state.results,
      objectDetails: {
        ...state.results.objectDetails,
        ...action.list
      }
    }
  })),
  on(DashboardActions.explore, (state, action) => {
    const currentItem = Object.keys(state.results.resultSets)
      .map((key) =>
        Object.keys(state.results.resultSets[key].items)
          .map((keyClass) => state.results.resultSets[key].items[keyClass].find((item) => item.id === action.id))
          .find((it) => !!it)
      )
      .find((it) => !!it) as Item;

    const actualWindows = state.manifests.manifest.windows;

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: actualWindows.concat({
            widgets: [
              {
                layout: { x: 1, y: 1, width: 12, height: 12 },
                type: 'graph',
                options: {},
                datasource: EXPLORE_NAMED_QUERY_ID
              }
            ]
          })
        }
      },
      results: {
        ...state.results,
        resultSets: {
          ...state.results.resultSets,
          [EXPLORE_NAMED_QUERY_ID]: {
            items: { [currentItem.oClass]: [currentItem] },
            relations: [] as Relation[]
          }
        }
      }
    };
  }),
  on(DashboardActions.setRefreshRate, (state, action) => {
    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          refreshRates: { ...state.manifests.manifest.refreshRates, [action.id]: action.rate }
        }
      }
    };
  }),
  on(DashboardActions.addRelationsToResultSets, (state, action) => {
    const updatedResultSets = JSON.parse(JSON.stringify(state.results.resultSets));
    action.relations.forEach((relation) => {
      Object.keys(updatedResultSets).forEach((rsId) => {
        const isConcerned = Object.keys(updatedResultSets[rsId].items).map((classId) => {
          return updatedResultSets[rsId].items[classId].map(
            (item: Item) => item.id === relation.source || item.id === relation.destination
          );
        });
        if (isConcerned) {
          updatedResultSets[rsId].relations.push(relation);
        }
      });
    });
    return {
      ...state,
      results: {
        ...state.results,
        resultSets: updatedResultSets
      }
    };
  }),
  on(DashboardActions.addItemToResultSets, (state, action) => {
    const updatedResultSets = JSON.parse(JSON.stringify(state.results.resultSets));

    if (!!action.resultSet) {
      if (!updatedResultSets[action.resultSet].items[action.item.oClass]) {
        updatedResultSets[action.resultSet].items[action.item.oClass] = [action.item];
      } else {
        updatedResultSets[action.resultSet].items[action.item.oClass].push(action.item);
      }
    }

    return {
      ...state,
      results: {
        ...state.results,
        resultSets: updatedResultSets
      }
    };
  }),
  on(DashboardActions.quickOrder, (state, action) => {
    return {
      ...state,
      results: {
        ...state.results,
        quickOrder: {
          ...state.results.quickOrder,
          [action.datasourceId]: action.asc ? { attribute: action.attribute, asc: action.asc } : undefined
        }
      }
    };
  }),
  on(DashboardActions.selectPresentation, (state, action) => {
    return {
      ...state,
      presentation: {
        ...state.presentation,
        current: action.presentation,
        viewMode: action.viewMode,
        initial: action.presentation ? state.presentation.initial : undefined
      }
    };
  }),
  on(DashboardActions.setInitialPresentation, (state, action) => {
    return {
      ...state,
      presentation: {
        ...state.presentation,
        initial: action.initial
      }
    };
  }),
  on(DashboardActions.setGridLayout, (state, action) => {
    const myRank = state.manifests.tenants.indexOf(state.manifests.sender);
    const newWindows = JSON.parse(JSON.stringify(state.manifests.manifest.windows ?? []));
    if (!newWindows[myRank]) {
      newWindows[myRank] = { widgets: [] };
    }
    if (!newWindows[myRank].grid) {
      newWindows[myRank].grid = {};
    }
    if (!newWindows[myRank].widgets) {
      newWindows[myRank].widgets = [];
    }
    newWindows[myRank].grid.layout = action.layout;
    if (action.layout !== DashboardGridLayout.MANUAL) {
      const layout = WidgetPlacementUtils.getLayout(action.layout);
      // Reorder layouts
      newWindows[myRank].grid = {
        ...newWindows[myRank].grid,
        rows: layout?.rows ?? DEFAULT_ROWS_NUMBER,
        columns: layout?.columns ?? DEFAULT_COLUMNS_NUMBER
      };
      const places = WidgetPlacementUtils.placementOptions({} as WidgetManifest, action.layout);

      newWindows[myRank].widgets.forEach((widget: WidgetManifest, idx: number) => {
        let targetLayout = places[idx]?.layout;
        if (!targetLayout) {
          targetLayout = { x: 1, y: 1, width: 1, height: 1 };
          console.warn('Incorrect placement calculation', places, idx, widget, action.layout);
        }
        widget.layout = { ...targetLayout };
      });
    }

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.createTab, (state, action) => {
    const myRank = state.manifests.tenants.indexOf(state.manifests.sender);
    const myLayout = state.manifests.manifest.windows[myRank].grid?.layout ?? DashboardGridLayout.MANUAL;
    const newWindows = JSON.parse(JSON.stringify(state.manifests.manifest.windows));
    newWindows.push({ grid: { layout: myLayout }, widgets: [] });
    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.restoreInitialManifest, (state, action) => {
    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: JSON.parse(JSON.stringify(state.presentation.initial))
      }
    };
  }),
  on(DashboardActions.propagateGridLayout, (state, action) => {
    const newWindows = JSON.parse(JSON.stringify(state.manifests.manifest.windows));
    newWindows[action.rank] = action.manifest;

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          windows: newWindows
        }
      }
    };
  }),
  on(DashboardActions.setFilters, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        filters: action.filters
      }
    }
  })),
  on(DashboardActions.updateFilters, (state, action) => {
    const isPresent = state.manifests.manifest.filters?.find((filter) => filter.id === action.filter.id);
    let filters = [];
    if (isPresent) {
      filters =
        state.manifests.manifest.filters?.map((filter) => (filter.id === action.filter.id ? action.filter : filter)) ??
        [];
    } else {
      if (state.manifests.manifest.filters) {
        filters = [...(state.manifests.manifest.filters as Filter[]), action.filter];
      } else {
        filters = [action.filter];
      }
    }
    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          filters: filters
        }
      }
    };
  }),
  on(DashboardActions.removeFilter, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        filters: state.manifests.manifest.filters?.filter((filter) => filter.id !== action.id)
      }
    }
  })),
  on(DashboardActions.removeFilters, (state) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        filters: []
      }
    }
  })),
  on(DashboardActions.updateFilterValue, (state, action) => {
    const filters = JSON.parse(JSON.stringify(state.manifests.manifest.filters ?? [])) as Filter[];

    const filterToUpdate = filters.find((filter) => filter.id === action.id);
    if (filterToUpdate) {
      if (!action.value) {
        delete filterToUpdate.value;
      } else {
        filterToUpdate.value = action.value;
      }
    }

    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          filters
        }
      }
    };
  }),
  on(DashboardActions.clearAllFilterValues, (state, action) => {
    return {
      ...state,
      manifests: {
        ...state.manifests,
        manifest: {
          ...state.manifests.manifest,
          filters: state.manifests.manifest.filters?.map((filter) => ({ ...filter, value: undefined }))
        }
      }
    };
  }),
  on(DashboardActions.getWmsFeatures, DashboardActions.resetWmsFeatures, (state, action) => ({
    ...state,
    wmsFeatures: []
  })),
  on(DashboardActions.addWmsFeatures, (state, action) => {
    const allFeatures = [...state.wmsFeatures, ...action.features];
    const deDupedIds = [...new Set(allFeatures.map((feat) => feat.id))];
    return {
      ...state,
      wmsFeatures: deDupedIds.map((id) => allFeatures.find((feat) => feat.id === id))
    };
  }),
  on(DashboardActions.fetchStaticManifest, (state, action) => {
    return {
      ...state,
      manifests: {
        ...state.manifests,
        loading: true
      }
    };
  }),
  on(DashboardActions.endLoading, (state, action) => {
    return {
      ...state,
      manifests: {
        ...state.manifests,
        loading: false
      }
    };
  }),
  on(DashboardActions.updateDisplayOptions, (state, action) => {
    return {
      ...state,
      display: action.customDisplay ? action.customDisplay : getDisplayOptions(action.mode)
    };
  }),
  on(DashboardActions.updateCapability, (state, action) => {
    return {
      ...state,
      capabilities: {
        ...state.capabilities,
        [action.url]: action.capability
      }
    };
  }),
  on(DashboardActions.loadPresentation, (state) => ({
    ...state,
    manifests: {
      ...state.manifests,
      loading: true
    }
  })),
  on(DashboardActions.initDefaultLayerGroup, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        layerGroups: state.manifests.manifest.layerGroups?.some((group) => group.name === 'DEFAULT')
          ? state.manifests.manifest.layerGroups.map((group) =>
              action.layers ? { ...group, visibleLayers: action.layers } : group
            )
          : [
              ...(state.manifests.manifest.layerGroups ?? []),
              {
                name: 'DEFAULT',
                singleLayer: false,
                visibleLayers: action.layers ? action.layers : ([] as string[])
              }
            ]
      }
    }
  })),
  on(DashboardActions.addLayerGroup, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        layerGroups: [
          ...(state.manifests.manifest.layerGroups ?? []),
          {
            name: action.defaultTitle + ' ' + ((state.manifests.manifest.layerGroups?.length ?? 0) + 1).toString(),
            singleLayer: false,
            visibleLayers: [] as string[]
          }
        ]
      }
    }
  })),
  on(DashboardActions.updateLayerGroup, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        layerGroups: [
          ...(state.manifests.manifest.layerGroups ?? []).map((group) =>
            group.name === action.name
              ? {
                  ...group,
                  name: action.newName ?? group.name,
                  singleLayer: action.singleLayer ?? group.singleLayer,
                  visibleLayers: action.visibleLayers
                    ? typeof action.visibleLayers === 'string'
                      ? [...group.visibleLayers, action.visibleLayers]
                      : action.visibleLayers
                    : group.visibleLayers
                }
              : group
          )
        ]
      }
    }
  })),
  on(DashboardActions.deleteLayerGroup, (state, action) => ({
    ...state,
    manifests: {
      ...state.manifests,
      manifest: {
        ...state.manifests.manifest,
        layerGroups: state.manifests.manifest.layerGroups!.filter((group) => group.name !== action.name)
      }
    }
  }))
);

export function dashboardReducer(state: DashboardState, action: Action) {
  return internalReducer(state, action);
}
