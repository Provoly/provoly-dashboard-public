import { createAction, props } from '@ngrx/store';
import { PrySnackMessage } from '../../core/components/snackbar/snack.interface';
import { DisplayOptions } from '../../core/model/display-options.interface';
import { Filter } from '../../core/model/filter.interface';
import { Item } from '../../core/model/item.interface';
import {
  DashboardManifest,
  GlobalManifest,
  ManifestDescription,
  WidgetManifest
} from '../../core/model/manifest.interface';
import { Relation } from '../../core/model/relation.interface';
import { OrderValue } from '../../core/model/result-order.interface';
import { ResultSet, ResultSets } from '../../core/model/result-set.interface';
import { GetCapabilitiesResponse } from './wms.service';

export type DashboardCellParams = {
  gridWidth: number;
  gridHeight: number;
  gridGap: number;
  columns: number;
  cellHeight: number;
  rows: number;
  cellWidth: number;
  offsetLeft: number;
  offsetTop: number;
  mobileMode: boolean;
};

export enum ViewMode {
  CATALOG = 'catalog',
  CONSULT = 'consult',
  CREATION = 'creation',
  EDITION = 'edition',
  EDITOR = 'editor',
  SEARCH = 'search',
  CUSTOM = 'custom'
}

export const DashboardActions = {
  join: createAction('[Dashboard] joined', props<{ sender: string }>()),
  leave: createAction('[Dashboard] leave', props<{ sender: string }>()),
  updateManifest: createAction(
    '[Dashboard] (bus) updating manifest',
    props<{
      tenants?: string[];
      manifest: GlobalManifest;
      resultSets?: ResultSets;
      joining?: boolean;
      manifestId?: string;
      selectedIds: string[];
    }>()
  ),
  updateManifestAfterFetch: createAction(
    '[Dashboard] (bus) updating manifest after fetch',
    props<{
      tenants?: string[];
      manifest: GlobalManifest;
      resultSets?: ResultSets;
      joining?: boolean;
      manifestId?: string;
      selectedIds: string[];
    }>()
  ),
  updateManifestWithoutActivation: createAction(
    '[Dashboard] (bus) updating manifest but do not activate it',
    props<{
      tenants?: string[];
      manifest: GlobalManifest;
      resultSets?: ResultSets;
      joining?: boolean;
      manifestId?: string;
      selectedIds: string[];
    }>()
  ),
  updateManifestAfterTenantJoin: createAction(
    '[Dashboard] (bus) updating manifest after tenant join',
    props<{
      tenants?: string[];
      manifest: GlobalManifest;
      resultSets?: ResultSets;
      joining?: boolean;
      manifestId?: string;
      selectedIds: string[];
      presentation?: { current?: ManifestDescription; initial?: GlobalManifest; viewMode?: ViewMode };
      display?: DisplayOptions;
    }>()
  ),
  updateManifestAfterTenantLeave: createAction(
    '[Dashboard] (bus) updating manifest after tenant leave',
    props<{
      tenants?: string[];
      manifest: GlobalManifest;
      resultSets?: ResultSets;
      joining?: boolean;
      manifestId?: string;
      selectedIds: string[];
    }>()
  ),
  selectPresentation: createAction(
    '[Dashboard] (bus) selectPresentation',
    props<{
      presentation: ManifestDescription | undefined;
      viewMode?: ViewMode;
    }>()
  ),
  setInitialPresentation: createAction(
    '[Dashboard] (bus) set initial presentation',
    props<{
      initial?: GlobalManifest;
    }>()
  ),
  declareSenderId: createAction('[Dashboard] self-updating manifest', props<{ tenants: string[]; sender: string }>()),
  updateDashboardManifest: createAction(
    '[Dashboard] updating dashboard view',
    props<{ manifest: DashboardManifest }>()
  ),
  updateWidgetManifest: createAction(
    '[Dashboard] updating widget view',
    props<{ manifest: WidgetManifest; index: number }>()
  ),
  addWidgetToPresentation: createAction(
    '[Dashboard] add widget to presentation',
    props<{ id?: string | string[]; widgetType: string; additionalOptions?: any; alert?: boolean }>()
  ),
  updateWidgetInPresentation: createAction(
    '[Dashboard] update widget in presentation',
    props<{ id?: string | string[]; widgetType: string; additionalOptions?: any }>()
  ),
  requestAllRoutes: createAction('[Dashboard] (bus) requesting route update'),
  requestManifestsToEmit: createAction('[Dashboard] (bus) pre-save manifest, asking all widgets to emit'),
  updateRouteManifest: createAction('[Dashboard] (bus) updating route', props<{ sender?: string; route: string }>()),
  fetchManifestsList: createAction('[Dashboard] (bus) fetching available manifests'),
  setRefreshRate: createAction('[Dashboard] (bus) setting refreshRate', props<{ id: string; rate: number }>()),
  updateManifestsList: createAction(
    '[Dashboard] (bus) received manifests list',
    props<{ manifests: ManifestDescription[] }>()
  ),
  fetchStaticManifest: createAction('[Dashboard] (bus) fetching staticManifest', props<{ id: string }>()),
  fetchMoreItems: createAction('[Dashboard] (bus) fetching more items', props<{ id: string; widgetType: string }>()),
  endLoading: createAction('[Dashboard] end loading'),
  updateStaticManifest: createAction(
    '[Dashboard] (bus) received staticManifest',
    props<{ staticManifest: GlobalManifest }>()
  ),
  loadManifest: createAction('[Dashboard] (bus) load manifest', props<{ id: string }>()),
  loadAndActivateManifest: createAction('[Dashboard] (bus) load and activate manifest', props<{ id: string }>()),
  downloadManifest: createAction('[Dashboard] download manifest', props<{ id: string; name: string }>()),
  confirmManifestDeletion: createAction('[Dashboard] confirm manifest deletion', props<{ id: string }>()),
  deleteManifest: createAction('[Dashboard] deleting manifest', props<{ id: string }>()),
  saveManifest: createAction(
    '[Dashboard] save manifest',
    props<{
      name: string;
      manifest?: GlobalManifest;
      id: string;
      description?: string;
      image?: string;
      metadata?: { metadataDefId: string; value: string }[];
      accessRightsByGroup?: { [key: string]: string[] };
      additionalInformation?: string;
    }>()
  ),
  solveCollisions: createAction('[Dashboard] solving collisions'),
  clearManifest: createAction('[Dashboard] clear manifest'),
  followManifestRoute: createAction('[Dashboard] (bus) follow manifest route'),
  moveWidget: createAction('[Dashboard] moving widget', props<{ widgetIndex: number; targetIndex: number }>()),
  maximizeWidget: createAction('[Dashboard] maximize widget', props<{ widgetIndex: number }>()),
  assertResultSets: createAction('[Dashboard] assert resultSet', props<{ staticManifest?: DashboardManifest }>()),
  updateResultSet: createAction(
    '[Dashboard] (bus) received named resultSet (not-active-action)',
    props<{ id: string; resultSet: ResultSet; params?: string; next?: boolean }>()
  ),
  addRelationsToResultSets: createAction(
    '[Dashboard] (bus) add relations to resultSet',
    props<{ relations: Relation[] }>()
  ),
  addItemToResultSets: createAction(
    '[Dashboard] (bus) add item to resultSet',
    props<{ item: Item; resultSet?: string }>()
  ),
  startingMissingViews: createAction('[Dashboard] opening missing views for manifest'),
  setAvailableNamedQueries: createAction('[Dashboard] (bus) set available rs names', props<{ names: string[] }>()),
  setDefaultDatasource: createAction('[Dashboard] set current rs name', props<{ names: string[] }>()),
  updateDashboardParams: createAction(
    '[Dashboard] set dashboard cell params',
    props<{ params: Partial<DashboardCellParams> }>()
  ),
  toggleEditionMode: createAction('[Dashboard] toggle edition mode', props<{ force?: boolean }>()),
  select: createAction('[Dashboard] (bus) select item', props<{ id: string; cumulative: boolean }>()),
  selectMany: createAction('[Dashboard] (bus) select items', props<{ ids: string[] }>()),
  invertSelection: createAction('[Dashboard] (bus) invert selection'),
  fetchObjectsDetails: createAction('[Dashboard] fetch objects details', props<{ ids: string[] }>()),
  updateObjectsDetails: createAction(
    '[Dashboard] (bus) update objects details',
    props<{ list: { [id: string]: Item } }>()
  ),
  explore: createAction('[Dashboard] (bus) isolate in data set', props<{ id: string }>()),
  detail: createAction('[Dashboard] (bus) add detail view', props<{ ids: string[] }>()),
  proximity: createAction('[Dashboard] proximity search', props<{ id: string; targetResultSet: string }>()),
  multiSnackBar: createAction('[Dashboard] (bus) display snack message', props<{ message: PrySnackMessage }>()),
  quickOrder: createAction(
    '[Dashboard] (bus) quick order',
    props<{ datasourceId: string; attribute: string; asc: OrderValue }>()
  ),
  setGridLayout: createAction('[Dashboard] set grid layout', props<{ layout: string }>()),
  propagateGridLayout: createAction(
    '[Dashboard] (bus) change grid layout',
    props<{ manifest: DashboardManifest; rank: number }>()
  ),
  createTab: createAction('[Dashboard] (bus) create new tab'),
  restoreInitialManifest: createAction('[Dashboard] (bus) restoring missing tabs'),
  setFilters: createAction('[Dashboard] (bus) set datasource filters', props<{ filters: Filter[] }>()),
  updateFilters: createAction('[Dashboard] (bus) update datasource filters', props<{ filter: Filter }>()),
  removeFilter: createAction('[Dashboard] (bus) remove filter in presentation', props<{ id: string }>()),
  removeFilters: createAction('[Dashboard] (bus) remove filters'),
  updateFilterValue: createAction(
    '[Dashboard] (bus) update filter value',
    props<{ id: string; value: any; datasourceId: string }>()
  ),
  clearAllFilterValues: createAction('[Dashboard] (bus) clear all filter values'),
  dispatchFilters: createAction('[Dashboard] (bus) apply filters to presentation datasources'),
  resetWmsFeatures: createAction('[Widget map] Reset Wms layer features', props<{ componentId: string }>()),
  getWmsFeatures: createAction(
    '[Widget map] Get Wms layer features',
    props<{ url: string; oClass: string; coordinates: number[]; componentId: string }>()
  ),
  addWmsFeatures: createAction('[Widget map] Set Wms layer features', props<{ features: any; componentId: string }>()),
  getWfsFeatures: createAction(
    '[Widget map] Get wfs Features for point',
    props<{ url: string; oClass: string; coordinates: number[]; style: string }>()
  ),
  getWfsFeaturesForPointStackTooltips: createAction(
    '[Widget map] Get wfs Features for showing stack tooltips',
    props<{ url: string; oClass: string; coordinates: number[]; componentId: string }>()
  ),
  updateDisplayOptions: createAction(
    '[Dashboard/Display] (bus) Update displayed dashboard management features',
    props<{ mode: ViewMode; customDisplay?: DisplayOptions }>()
  ),
  getCapability: createAction('[Widget map] Get Wms capability', props<{ url: string; force?: boolean }>()),
  updateCapability: createAction(
    '[Widget map] Store Wms capability',
    props<{ url: string; capability: GetCapabilitiesResponse | null }>()
  ),
  addManifestMetadata: createAction(
    '[Dashboard] Add manifest metadata',
    props<{ presentationId: string; metadataId: string; value: string }>()
  ),
  deleteManifestMetadata: createAction(
    '[Dashboard] Delete manifest metadata',
    props<{ presentationId: string; metadataId: string }>()
  ),
  triggerAggregate: createAction('[Dashboard] (bus) Triggering aggregates for datasource', props<{ id: string }>()),
  loadPresentation: createAction(
    '[Dashboard] load presentation',
    props<{ presentation: ManifestDescription; viewMode: ViewMode }>()
  )
};
