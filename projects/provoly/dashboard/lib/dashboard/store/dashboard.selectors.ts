import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import equal from 'fast-deep-equal/es6';
import { Filter, FilterContext } from '../../core/model/filter.interface';
import { Item } from '../../core/model/item.interface';
import {
  DashboardGridLayout,
  DashboardManifest,
  GlobalManifest,
  WidgetLayout,
  WidgetManifest
} from '../../core/model/manifest.interface';
import { ResultOrder } from '../../core/model/result-order.interface';
import { ResultSet, ResultSets } from '../../core/model/result-set.interface';
import { DashboardCellParams } from './dashboard.actions';
import { DashboardState } from './dashboard.reducers';
import { BASE_DISPLAY_OPTIONS } from '../../core/model/display-options.interface';

const NEW_WINDOW_TARGET = -1;

const feature = createFeatureSelector<DashboardState>('@pry/dashboard');
const manifests = createSelector(feature, (state: DashboardState) => state?.manifests);
const rank = createSelector(manifests, (manifests) => manifests?.tenants.indexOf(manifests.sender));
const currentManifestId = createSelector(manifests, (manifests) => manifests.currentId);
const globalManifest = createSelector(
  manifests,
  // @ts-ignore
  (manifests) => ({ windows: [], ...manifests?.manifest }) ?? ({ windows: [] } as GlobalManifest)
);
const staticManifest = createSelector(
  manifests,
  // @ts-ignore
  (manifests) => ({ windows: [], ...manifests?.staticManifest }) ?? ({ windows: [] } as GlobalManifest)
);
const loading = createSelector(manifests, (manifests) => !!manifests?.loading);
const refreshRates = createSelector(globalManifest, (manifests) => manifests.refreshRates ?? {});
const windowManifest = createSelector(
  globalManifest,
  rank,
  (manifest, rank) => manifest.windows[rank] ?? <DashboardManifest>{ widgets: [] }
);
const gridLayout = createSelector(
  windowManifest,
  (manifest) => ((manifest.grid ?? {}).layout ?? DashboardGridLayout.MANUAL) as string
);
const memoizeWidgetManifest = {} as any;
const widgetManifest = (index: number) => {
  if (!memoizeWidgetManifest[index]) {
    memoizeWidgetManifest[index] = createSelector(
      windowManifest,
      (windowManifest: DashboardManifest) =>
        windowManifest.widgets[index] ??
        ({
          type: 'placeholder',
          layout: { x: 1, y: 1, width: 1, height: 1 }
        } as WidgetManifest)
    );
  }
  return memoizeWidgetManifest[index] as MemoizedSelector<DashboardManifest, WidgetManifest>;
};
const manifestsList = createSelector(manifests, (manifests) => manifests.list);
const tenants = createSelector(manifests, (manifests) => manifests.tenants ?? <string[]>[]);
const targetTenantsIndexes = createSelector(manifests, rank, (manifests, rank) => [
  NEW_WINDOW_TARGET,
  ...(manifests.tenants ?? ([] as string[])).map((ten, idx) => idx).filter((idx) => idx !== rank)
]);
const results = createSelector(feature, (state: DashboardState) => state?.results);

const resultSets = createSelector(results, (results) => results.resultSets ?? ({} as ResultSets));
const resultSetsParams = createSelector(
  results,
  (results) => results.resultSetsParams ?? ({} as { [id: string]: string | undefined })
);
const namedQueriesNames = createSelector(resultSets, (state: ResultSets) => Object.keys(state) ?? <string[]>[]);
const availableNamedQueries = createSelector(results, (results) => {
  return [...new Set([...results.availableDatasourceNames, ...Object.keys(results.resultSets)])];
});
const defaultDatasourceNames = createSelector(results, (results) => results.defaultDatasource ?? 'current');
const selectedItemIds = createSelector(results, (results) => results.selectedItems ?? ([] as string[]));
const objectDetails = createSelector(results, (results) => results.objectDetails ?? ({} as { [id: string]: Item }));
const quickOrder = createSelector(results, (results) => results.quickOrder ?? ({} as { [id: string]: ResultOrder }));
const allItems = createSelector(results, (results) =>
  Object.keys(results.resultSets)
    .map((rsKey) =>
      Object.keys(results.resultSets[rsKey].items)
        .map((classKey) => (results.resultSets[rsKey] as ResultSet).items[classKey])
        .reduce((p, c) => [...p, ...c], [])
    )
    .reduce((p, c) => [...p, ...c], [])
);
const getItemsByIds = (ids: string[]) =>
  createSelector(allItems, (items) => items.filter((item) => ids.includes(item.id)));
const selectedItems = createSelector(
  selectedItemIds,
  allItems,
  (itemNames, allItems) => itemNames.map((name) => allItems.find((it) => it.id === name)) ?? ([] as Item[])
);
const dashboard = createSelector(feature, (state: DashboardState) => state?.dashboard ?? {});
const dashboardCellParams = createSelector(dashboard, (dashboard) => dashboard.params ?? <DashboardCellParams>{});
const dashboardEditionMode = createSelector(dashboard, (dashboard) => dashboard.editionMode ?? false);
const namedQueriesUses = createSelector(globalManifest, (manifest) =>
  manifest.windows
    .map((window, idx) => ({ windowIndex: idx, widgets: window.widgets }))
    .map(({ windowIndex, widgets }) =>
      (widgets ?? []).map((widget) =>
        (Array.isArray(widget.datasource) ? widget.datasource : [widget.datasource])
          .filter((rsName) => rsName !== undefined)
          .map((rsName) => ({
            rsName,
            windowIndex,
            type: widget.type,
            layout: widget.layout
          }))
      )
    )
    .reduce((p, c) => [...p, ...c], [])
    .reduce((p, c) => [...p, ...c], [])
    .reduce(
      (p, c) => ({ ...p, [c.rsName ?? '']: [...(p[c.rsName ?? ''] || []), { ...c }] }),
      {} as { [key: string]: { windowIndex: number; type: string; layout: WidgetLayout; rsName?: string }[] }
    )
);
const presentation = createSelector(feature, (state: DashboardState) => state?.presentation);
const isCurrentPresentationModified = createSelector(
  presentation,
  globalManifest,
  (state, global) => !equal(global, state.initial)
);
const currentManifest = createSelector(feature, (state: DashboardState) => state?.presentation.current);

const filters = createSelector(feature, (state: DashboardState) => state?.manifests.manifest.filters ?? []);
const datasourceFilters = createSelector(feature, (state: DashboardState) =>
  state?.manifests.manifest.filters
    ? state?.manifests.manifest.filters.reduce(
        (obj: { [datasourceId: string]: FilterContext[] }, filter: Filter) => (
          filter.attributes.forEach((attribute) =>
            (obj[attribute.datasource] || (obj[attribute.datasource] = [])).push({
              attribute: attribute.id,
              operator: filter.operator ?? '',
              value: filter.value,
              type: filter.type
            })
          ),
          obj
        ),
        {}
      )
    : {}
);

const memoizeFeatures = {} as { [key: string]: any };
const wmsFeatures = (componentId: string) => {
  if (!memoizeFeatures[componentId]) {
    memoizeFeatures[componentId] = createSelector(
      feature,
      (state: DashboardState) => state.wmsFeatures[componentId] ?? []
    );
  }
  return memoizeFeatures[componentId] as MemoizedSelector<object, any[], (s1: DashboardState) => any[]>;
};

const displayOptions = createSelector(feature, (state: DashboardState) => state?.display ?? BASE_DISPLAY_OPTIONS);
const capabilities = createSelector(feature, (state: DashboardState) => state?.capabilities);
const layerGroups = createSelector(feature, (state: DashboardState) => state?.manifests.manifest.layerGroups ?? []);

export const DashboardSelectors = {
  feature,
  rank,
  currentManifestId,
  globalManifest,
  refreshRates,
  windowManifest,
  widgetManifest,
  manifestsList,
  gridLayout,
  tenants,
  resultSets,
  resultSetsParams,
  namedQueriesNames,
  namedQueriesUses,
  availableNamedQueries,
  defaultDatasourceNames,
  selectedItemIds,
  allItems,
  getItemsByIds,
  selectedItems,
  objectDetails,
  targetTenantsIndexes,
  dashboard,
  dashboardCellParams,
  dashboardEditionMode,
  staticManifest,
  loading,
  quickOrder,
  presentation,
  currentManifest,
  filters,
  isCurrentPresentationModified,
  datasourceFilters,
  wmsFeatures,
  displayOptions,
  capabilities,
  layerGroups
};
