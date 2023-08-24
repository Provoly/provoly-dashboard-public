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
import { DashboardCellParams, ViewMode } from './dashboard.actions';
import { DashboardState } from './dashboard.reducers';
import { ManifestService } from './manifest.service';

const NEW_WINDOW_TARGET = -1;

const feature = createFeatureSelector<DashboardState>('@pry/dashboard');
const manifests = createSelector(feature, (state: DashboardState) => state?.manifests);
const rank = createSelector(manifests, (manifests) => manifests?.tenants.indexOf(manifests.sender));
const currentManifestId = createSelector(manifests, (manifests) => manifests.currentId);
const globalManifest = createSelector(
  manifests,
  // @ts-ignore
  (manifests) => ({ windows: [], ...manifests?.manifest } ?? ({ windows: [] } as GlobalManifest))
);
const manifestDatasources = createSelector(globalManifest, (manifest) =>
  ManifestService.getDatasourcesUsedByManifest(manifest)
);
const staticManifest = createSelector(
  manifests,
  // @ts-ignore
  (manifests) => ({ windows: [], ...manifests?.staticManifest } ?? ({ windows: [] } as GlobalManifest))
);
const refreshRates = createSelector(globalManifest, (manifests) => manifests.refreshRates ?? {});
const windowManifest = createSelector(
  globalManifest,
  rank,
  (manifest, rank) => manifest.windows[rank] ?? <DashboardManifest>{ widgets: [] }
);
const gridLayout = createSelector(
  windowManifest,
  (manifest) => (manifest.grid ?? {}).layout ?? DashboardGridLayout.MANUAL
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
  return [...new Set([...results.availableDatasourceNames, ...Object.keys(results.resultSets)])] ?? <string[]>[];
});
const defaultDatasourceNames = createSelector(results, (results) => results.defaultDatasource ?? 'current');
const selectedItemIds = createSelector(results, (results) => results.selectedItems ?? ([] as string[]));
const objectDetails = createSelector(results, (results) => results.objectDetails ?? ({} as { [id: string]: Item }));
const quickOrder = createSelector(results, (results) => results.quickOrder ?? ({} as { [id: string]: ResultOrder }));
const address = createSelector(
  results,
  (results) => (results.address ?? {}) as { latLon: number[]; pointAddress: string }
);
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
      widgets.map((widget) =>
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
const savePresentationActive = createSelector(
  presentation,
  globalManifest,
  (state, global) =>
    !!state.current && state.current.owner && (state.viewMode === ViewMode.CREATION || !equal(global, state.initial))
);

const filters = createSelector(feature, (state: DashboardState) => state?.manifests.manifest.filters ?? {});
const datasourceFilters = createSelector(feature, (state: DashboardState) =>
  state?.manifests.manifest.filters
    ? state?.manifests.manifest.filters.reduce(
        (obj: { [datasourceId: string]: FilterContext[] }, filter: Filter) => (
          filter.attributes.forEach((attribute) =>
            (obj[attribute.datasource] || (obj[attribute.datasource] = [])).push({
              attribute: attribute.id,
              operator: filter.operator ?? '',
              value: filter.value
            })
          ),
          obj
        ),
        {}
      )
    : {}
);
const wmsFeatures = createSelector(feature, (state: DashboardState) => state?.wmsFeatures);

export const DashboardSelectors = {
  feature,
  rank,
  currentManifestId,
  globalManifest,
  manifestDatasources,
  refreshRates,
  windowManifest,
  widgetManifest,
  manifestsList,
  gridLayout,
  tenants,
  resultSets,
  resultSetsParams,
  address,
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
  quickOrder,
  presentation,
  savePresentationActive,
  filters,
  datasourceFilters,
  wmsFeatures
};
