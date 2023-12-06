import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { combineLatest, merge, of, startWith, throwError } from 'rxjs';
import { catchError, debounceTime, delay, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  PryDialogConfirmComponent,
  PryDialogConfirmData
} from '../../core/components/overlay/dialog-confirm.component';
import { PryDialogService } from '../../core/components/overlay/dialog.service';
import { PryVisibilityType } from '../../core/components/share/share.model';
import { PrySnackbarService } from '../../core/components/snackbar/snackbar.service';
import { PryI18nService } from '../../core/i18n/i18n.service';
import { DashboardGridLayout, GlobalManifest, WidgetManifest } from '../../core/model/manifest.interface';
import { ChartWidgetOptions } from '../../core/model/widget-chart-manifest.interface';
import { MapWidgetOptions } from '../../core/model/widget-map-manifest.interface';
import { ItemService } from '../../core/store/item/item.service';
import { SearchActions } from '../../core/store/search/search.actions';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from '../../core/store/search/search.constants';
import { SearchService } from '../../core/store/search/search.service';
import { ToolboxManifestService } from '../../core/toolbox/toolbox-manifest.service';
import { BusService } from '../action-bus/service/bus.service';
import { WidgetPlacementUtils } from '../components/widgets/widget-placement/widget-placement.utils';
import { ResultsetUtils } from '../resultset-utils';
import { DashboardInitService } from './dashboard-init.service';
import { DashboardActions } from './dashboard.actions';
import { DashboardSelectors } from './dashboard.selectors';
import { ManifestService } from './manifest.service';
import { RefreshService } from './refresh.service';
import { PryTitleService } from './title.service';
import { WmsService } from './wms.service';
import { WidgetFactoryService } from '../components/widgets/widget-instanciator/widget-factory.service';

@Injectable()
export class DashboardEffects {
  join$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.join),
      withLatestFrom(
        this.store.select(DashboardSelectors.rank),
        this.store.select(DashboardSelectors.tenants),
        this.store.select(DashboardSelectors.globalManifest),
        this.store.select(DashboardSelectors.resultSets),
        this.store.select(DashboardSelectors.selectedItemIds),
        this.store.select(DashboardSelectors.presentation),
        this.store.select(DashboardSelectors.displayOptions)
      ),
      filter(([action, rank, tenants, manifest, resultSets, display]) => rank === 0),
      map(([action, rank, tenants, manifest, resultSets, selectedIds, presentation, display]) =>
        DashboardActions.updateManifestAfterTenantJoin({
          tenants, // we already have added tenant in the reduce of the "join" action
          manifest: {
            ...manifest,
            windows: manifest.windows
          },
          resultSets,
          selectedIds,
          joining: true,
          presentation,
          display
        })
      )
    )
  );

  leave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.leave),
      withLatestFrom(
        this.store.select(DashboardSelectors.rank),
        this.store.select(DashboardSelectors.tenants),
        this.store.select(DashboardSelectors.globalManifest),
        this.store.select(DashboardSelectors.selectedItemIds)
      ),
      filter(([action, rank, tenants, manifest]) => rank === 0 || (tenants[0] === action.sender && rank === 1)),
      map(([action, rank, tenants, manifest, selectedIds]) => {
        const leaverRank = tenants.indexOf(action.sender);
        const newTenantsList = [...tenants];
        const newWindowList = [...manifest.windows];
        if (leaverRank > -1) {
          newTenantsList.splice(leaverRank, 1);
          newWindowList.splice(leaverRank, 1);
        }

        return DashboardActions.updateManifestAfterTenantLeave({
          tenants: newTenantsList,
          manifest: {
            ...manifest,
            windows: newWindowList
          },
          selectedIds
        });
      })
    )
  );

  fetchStaticManifest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.fetchStaticManifest),
      withLatestFrom(this.store.select(DashboardSelectors.rank), this.store.select(DashboardSelectors.selectedItemIds)),
      filter(([action, rank]) => rank === 0),
      mergeMap(([action, rank]) =>
        this.manifestService
          .get(action.id)
          .pipe(map((staticManifest) => DashboardActions.updateStaticManifest({ staticManifest })))
      )
    )
  );

  fetchStaticManifestLoading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.fetchStaticManifest),
      delay(5000),
      map((action) => DashboardActions.endLoading())
    )
  );

  loadAndActivateManifest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadAndActivateManifest, DashboardActions.loadManifest),
      withLatestFrom(this.store.select(DashboardSelectors.rank), this.store.select(DashboardSelectors.selectedItemIds)),
      filter(([action, rank]) => rank === 0),
      mergeMap(([action, rank, selectedIds]) =>
        this.manifestService.get(action.id).pipe(
          mergeMap((manifest) => {
            return action.type === DashboardActions.loadAndActivateManifest.type
              ? [
                  DashboardActions.updateManifestAfterFetch({ manifest, manifestId: action.id, selectedIds }),
                  DashboardActions.followManifestRoute()
                ]
              : [DashboardActions.updateManifestWithoutActivation({ manifest, manifestId: action.id, selectedIds })];
          })
        )
      )
    )
  );

  clearManifest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.clearManifest),
      withLatestFrom(
        this.store.select(DashboardSelectors.globalManifest),
        this.store.select(DashboardSelectors.selectedItemIds)
      ),
      map(([action, manifest, selectedIds]) =>
        DashboardActions.updateManifestAfterFetch({ manifest, manifestId: '', selectedIds })
      )
    )
  );

  downloadManifest$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.downloadManifest),
        tap((action) =>
          this.manifestService.get(action.id).subscribe((manifest: GlobalManifest) => {
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifest));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute('href', dataStr);
            dlAnchorElem.setAttribute('download', `${action.name}.json`);
            dlAnchorElem.click();
          })
        )
      ),
    { dispatch: false }
  );

  followManifestRoute$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.followManifestRoute),
        withLatestFrom(this.store.select(DashboardSelectors.windowManifest)),
        tap(([action, manifest]) => {
          if (manifest.route) {
            this.router.navigateByUrl(manifest.route);
          }
        })
      ),
    { dispatch: false }
  );

  requestManifestRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.requestAllRoutes),
      map(() => DashboardActions.updateRouteManifest({ route: this.router.url }))
    )
  );

  assertResultSets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DashboardActions.assertResultSets,
        DashboardActions.dispatchFilters,
        DashboardActions.clearAllFilterValues
      ),
      withLatestFrom(
        this.store.select(DashboardSelectors.globalManifest),
        this.store.select(DashboardSelectors.resultSets),
        this.store.select(DashboardSelectors.resultSetsParams),
        this.store.select(DashboardSelectors.quickOrder)
      ),
      mergeMap(([action, manifest, resultSets, resultSetsParams, quickOrder]) => {
        // @ts-ignore
        if (!action.id) {
          // First send aggregate updates
          const toAggregateActions = (
            [
              ...new Set(
                manifest.windows
                  .map((winManifest) => (winManifest ?? {}).widgets ?? [])
                  .reduce((p, c) => [...p, ...c], [])
                  .map((widManifest) => this.widgetFactoryService.aggregatesToAutoLoad(widManifest))
                  .reduce((p, c) => [...p, ...c], [] as string[])
              )
            ] as string[]
          ).map((ds) => DashboardActions.triggerAggregate({ id: ds }));

          const toItemsActions = Object.values(
            manifest.windows
              .map((winManifest) => (winManifest ?? {}).widgets ?? [])
              .reduce((p, c) => [...p, ...c], [])
              .map((widManifest) => this.widgetFactoryService.datasourcesToAutoLoad(widManifest))
              .flat()
              .reduce(
                (p, c) => ({ ...p, [c.datasetId]: { ...p[c.datasetId], ...c } }),
                {} as { [key: string]: { datasetId: string; excludeGeo: boolean } }
              )
          )
            .filter(
              (resultSet) =>
                !!resultSet.datasetId &&
                resultSet.datasetId !== '' &&
                (!resultSets[resultSet.datasetId] ||
                  resultSetsParams[resultSet.datasetId] !==
                    this.searchService.getItemsSerializedParams(resultSet.datasetId, quickOrder))
            )
            .map((resultSet) =>
              SearchActions.getDatasourceItems({
                id: resultSet.datasetId,
                excludeGeo: resultSet.excludeGeo,
                from: 'DashboardEffects.assertResultSets$-1'
              })
            );

          return [...toItemsActions, ...toAggregateActions];
        } else {
          // @ts-ignore
          if (!resultSets[action.id]) {
            return [
              SearchActions.getDatasourceItems({
                // @ts-ignore
                id: action.id as string,
                excludeGeo: true,
                from: 'DashboardEffects.assertResultSets$-2'
              })
            ];
          }
          return [];
        }
      })
    )
  );

  sendAggregatesEvent$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.triggerAggregate),
        filter((action) => action.id !== DEFAULT_NAMED_QUERY_ID && action.id !== EXPLORE_NAMED_QUERY_ID),
        tap((action) => window.dispatchEvent(new CustomEvent('datasourceRefresh', { detail: action.id })))
      ),
    { dispatch: false }
  );

  resize$ = createEffect(() =>
    this.actions$.pipe(
      // forward new manifest after any of these types of actions
      ofType(
        DashboardActions.updateDashboardManifest,
        DashboardActions.moveWidget,
        DashboardActions.updateWidgetManifest
      ),
      // @ts-ignore
      filter((action) => !action.sender),
      withLatestFrom(
        this.store.select(DashboardSelectors.globalManifest),
        this.store.select(DashboardSelectors.tenants),
        this.store.select(DashboardSelectors.selectedItemIds)
      ),
      map(([action, manifest, tenants, selectedIds]) => {
        const params = {
          manifest,
          selectedIds
        } as { manifest: GlobalManifest; tenants: string[]; selectedIds: string[] };
        if (!!tenants && tenants.length > 1) {
          params.tenants = tenants;
        }
        return DashboardActions.updateManifestAfterResize(params);
      })
    )
  );

  startMissingViewAfterViewUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DashboardActions.updateManifest,
        DashboardActions.updateManifestAfterFetch,
        DashboardActions.updateManifestAfterResize,
        DashboardActions.updateManifestAfterTenantLeave,
        DashboardActions.updateManifestAfterTenantJoin,
        DashboardActions.explore,
        DashboardActions.detail,
        DashboardActions.restoreInitialManifest,
        DashboardActions.createTab
      ),
      withLatestFrom(this.store.select(DashboardSelectors.rank)),
      filter(([action, rank]) => rank === 0),
      mergeMap((action) => [
        DashboardActions.startingMissingViews(),
        DashboardActions.assertResultSets({}),
        DashboardActions.solveCollisions()
      ])
    )
  );

  updateTitle$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          DashboardActions.updateManifest,
          DashboardActions.updateManifestAfterTenantJoin,
          DashboardActions.updateManifestAfterTenantLeave,
          DashboardActions.updateManifestAfterFetch,
          DashboardActions.updateManifestAfterResize,
          DashboardActions.declareSenderId
        ),
        withLatestFrom(this.store.select(DashboardSelectors.rank)),
        tap(([action, rank]) => {
          this.titleService.changeTitle();
        })
      ),
    { dispatch: false }
  );

  openOther$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.startingMissingViews),
        withLatestFrom(
          this.store.select(DashboardSelectors.rank),
          this.store.select(DashboardSelectors.tenants),
          this.store.select(DashboardSelectors.globalManifest)
        ),
        debounceTime(1000),
        filter(([action, rank, tenants, manifest]) => rank === 0),
        tap(([action, rank, tenants, manifest]) => {
          manifest.windows.forEach((windowManifest, index) => {
            if (!tenants[index]) {
              // If no window is opened for this part, then open one
              window.open(windowManifest.route ?? window.location.pathname, '_blank');
            }
          });
        })
      ),
    { dispatch: false }
  );

  saveManifest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.saveManifest),
      withLatestFrom(this.store.select(DashboardSelectors.globalManifest)),
      mergeMap(([action, currentManifest]) =>
        this.manifestService
          .save(
            action.name,
            action.manifest ?? currentManifest,
            action.visibility ?? { type: PryVisibilityType.PRIVATE },
            action.id,
            action.description,
            action.image,
            action.cover,
            action.metadata
          )
          .pipe(
            tap(() =>
              this.snackBar.open({
                message: this.translateService.instant('@pry.toolbox.manifest.saved', { viewId: action.name }),
                type: 'success'
              })
            ),
            map(() => action.manifest ?? currentManifest),
            catchError((error) => {
              this.snackBar.open({
                message: this.translateService.instant('@pry.toolbox.manifest.saveErrorCode.' + error.error.code, {
                  name: action.name
                }),
                type: 'error'
              });
              return throwError(error);
            })
          )
      ),
      mergeMap((manifest) => [
        DashboardActions.fetchManifestsList(),
        DashboardActions.setInitialPresentation({ initial: manifest })
      ])
    )
  );

  listManifests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.fetchManifestsList),
      withLatestFrom(this.store.select(DashboardSelectors.rank)),
      filter(([action, rank]) => rank === 0 || rank === -1),
      mergeMap(([action, rank]) =>
        this.manifestService.list().pipe(map((manifests) => DashboardActions.updateManifestsList({ manifests })))
      )
    )
  );

  confirmManifestDeletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.confirmManifestDeletion),
        tap((action) => {
          const data: PryDialogConfirmData = {
            title: '@pry.widget.modalTitle',
            actions: [
              {
                id: 0,
                label: '@pry.toolbox.manifest.validate',
                actions: [DashboardActions.deleteManifest({ id: action.id })]
              },
              {
                id: 1,
                label: '@pry.toolbox.manifest.close',
                color: 'secondary'
              }
            ]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
        })
      ),
    { dispatch: false }
  );

  deleteManifest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.deleteManifest),
      mergeMap((action) =>
        this.manifestService.delete(action.id).pipe(map(() => DashboardActions.fetchManifestsList()))
      )
    )
  );

  fetchObjectsDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.fetchObjectsDetails),
      mergeMap((action) => merge(...action.ids.map((id) => this.itemService.get(id)))),
      map((item) => DashboardActions.updateObjectsDetails({ list: { [item.id]: item } }))
    )
  );

  proximitySearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.proximity),
      withLatestFrom(this.store.select(DashboardSelectors.resultSets)),
      mergeMap(([action, resultSets]) =>
        this.itemService.proximity(action.id).pipe(
          map((proxRs) => {
            return DashboardActions.updateResultSet({
              id: action.targetResultSet,
              resultSet: ResultsetUtils.mergeResultSets(proxRs, resultSets[action.targetResultSet])
            });
          })
        )
      )
    )
  );

  explore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.explore),
      mergeMap((action) => [DashboardActions.proximity({ id: action.id, targetResultSet: EXPLORE_NAMED_QUERY_ID })])
    )
  );

  detailAsLoadInWidget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.detail),
      map((action) =>
        DashboardActions.addWidgetToPresentation({
          id: '',
          widgetType: 'detail',
          additionalOptions: {
            itemIds: action.ids
          }
        })
      )
    )
  );

  updateWidgetInPresentation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.updateWidgetInPresentation),
      withLatestFrom(this.store.select(DashboardSelectors.globalManifest)),
      mergeMap(([action, manifest]) => {
        // Check if a widget with same datasource and type already exist in current presentation
        const widgetToMatch = this.toolboxManifestService.get(action.widgetType);

        let additionalMatchingFn: (optionsToMatch: any, options: any) => boolean;
        switch (widgetToMatch.type) {
          case 'chart':
            additionalMatchingFn = (optionsToMatch: ChartWidgetOptions, options: ChartWidgetOptions) =>
              optionsToMatch.type === options.type && optionsToMatch.subType === options.subType;
            break;
          case 'map':
            additionalMatchingFn = (optionsToMatch: MapWidgetOptions, options: MapWidgetOptions) =>
              !!options.layers!.find((layer) => layer.type === optionsToMatch.layers![0].type);
            break;
          default:
            additionalMatchingFn = (optionsToMatch: any, options: any) => true;
        }

        const matchingWidgets = manifest.windows.map((window) =>
          window.widgets
            .filter((widget) => widget.type === widgetToMatch.type)
            .filter(
              (widget) =>
                widget.datasource === action.id ||
                (widget.datasource![0] === action.id && widget.datasource!.length === 1)
            )
            .find((widget) => additionalMatchingFn(widgetToMatch.options, widget.options))
        );

        const alreadyMatchedWidget = matchingWidgets.find((window) => !!window);

        const result = [];
        if (alreadyMatchedWidget) {
          result.push(
            DashboardActions.multiSnackBar({
              message: {
                type: 'success',
                message: this.translateService.instant('@pry.widget.updatedInView', {
                  index: matchingWidgets.findIndex((widget) => !!widget) + 1
                })
              }
            })
          );
        } else {
          result.push(DashboardActions.addWidgetToPresentation({ ...action }));
        }

        return result;
      })
    )
  );

  addWidgetToPresentation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.addWidgetToPresentation),
      withLatestFrom(
        this.store.select(DashboardSelectors.gridLayout),
        this.store.select(DashboardSelectors.globalManifest),
        this.store.select(DashboardSelectors.rank),
        this.store.select(DashboardSelectors.dashboardCellParams),
        this.store.select(DashboardSelectors.selectedItemIds)
      ),
      map(([action, layout, _globalManifest, rank, params, selectedIds]) => {
        const manifestGlobal = JSON.parse(JSON.stringify(_globalManifest)) as GlobalManifest;

        // Create new configuration
        const newOptions = this.toolboxManifestService.get(action.widgetType) ?? {
          options: {},
          type: action.widgetType
        };
        const newWidgetManifest = {
          ...newOptions,
          layout: {},
          options: {
            ...newOptions.options,
            ...action.additionalOptions
          }
        } as WidgetManifest;
        if (!this.toolboxManifestService.isModel(action.widgetType) && newWidgetManifest.header !== false) {
          newWidgetManifest.header = { datasourceSelection: false };
        }

        if (!!action.id) {
          newWidgetManifest.datasource = action.id;
        }

        let found: { actualRank: number; widget: WidgetManifest } | null = null;
        // Try to find a spot in windows (starting by current rank, then in others)
        const sequence = WidgetPlacementUtils.swapArrayElements(
          new Array(manifestGlobal.windows.length).fill(0).map((_, idx, array) => idx),
          0,
          rank
        );
        // Trying all placement options
        for (const actualRank of sequence) {
          const windowLayout = manifestGlobal.windows[actualRank].grid?.layout ?? DashboardGridLayout.FULL;
          const options = WidgetPlacementUtils.placementOptions(newWidgetManifest, windowLayout, params);
          if (!found) {
            for (const option of options) {
              if (!found) {
                // Are we disjoint from all other widgets ?
                const isDisjointFromAll = (manifestGlobal.windows[actualRank].widgets ?? [])
                  .map((widget) => WidgetPlacementUtils.areDisjoint(widget, option))
                  .reduce((p, c) => p && c, true);
                if (isDisjointFromAll) {
                  // Found a disjoint placement !
                  found = { actualRank, widget: option } as { actualRank: number; widget: WidgetManifest };
                }
              }
            }
          }
        }

        if (!!found) {
          const placeWeFound = found as { actualRank: number; widget: WidgetManifest };
          manifestGlobal.windows[placeWeFound.actualRank].widgets.push(placeWeFound.widget);
        } else {
          const currentWindowLayout = manifestGlobal.windows[rank].grid?.layout ?? DashboardGridLayout.FULL;

          // si non trouvé : nouvelle page, première position suggérée
          const firstProposedLayout = WidgetPlacementUtils.placementOptions(
            newWidgetManifest,
            currentWindowLayout,
            params
          )[0];

          manifestGlobal.windows.push({ widgets: [firstProposedLayout], grid: { layout: currentWindowLayout } });
        }

        if (action.alert === undefined || action.alert === true) {
          const messageAction = DashboardActions.multiSnackBar({
            message: {
              type: 'success',
              message: this.translateService.instant('@pry.widget.addedInView', {
                index: !!found
                  ? (found as { actualRank: number; widget: WidgetManifest }).actualRank + 1
                  : manifestGlobal.windows.length
              })
            }
          });
          this.store.dispatch(messageAction);

          if (!found) {
            this.busService.bufferUntilJoined(messageAction);
          }
        }

        return DashboardActions.updateManifest({ manifest: manifestGlobal, selectedIds });
      })
    )
  );

  multiSnackBar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardActions.multiSnackBar),
        tap((action) => this.snackBar.open(action.message))
      ),
    { dispatch: false }
  );

  relaunchAfterOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.quickOrder),
      map((action) =>
        SearchActions.getDatasourceItems({
          id: action.datasourceId,
          excludeGeo: true,
          from: 'DashboardEffects.relaunchAfterOrder$'
        })
      )
    )
  );

  propagateGridLayout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.setGridLayout),
      withLatestFrom(this.store.select(DashboardSelectors.rank), this.store.select(DashboardSelectors.windowManifest)),
      map(([action, rank, windowManifest]) => DashboardActions.propagateGridLayout({ manifest: windowManifest, rank }))
    )
  );

  toggleEditionModeIfNotManual$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.setGridLayout),
      filter((action) => action.layout !== DashboardGridLayout.MANUAL),
      map(() => DashboardActions.toggleEditionMode({ force: false }))
    )
  );

  getCapability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.getCapability),
      withLatestFrom(this.store.select(DashboardSelectors.capabilities)),
      filter(
        ([action, capabilities]) =>
          (!!capabilities && !!action.url && (!capabilities[action.url] || !capabilities[action.url]!.doc)) ||
          !!action.force
      ),
      mergeMap(([action, _]) =>
        this.wmsService.getCapabilities(action.url).pipe(
          map((capability) => DashboardActions.updateCapability({ url: action.url, capability })),
          startWith(DashboardActions.updateCapability({ url: action.url, capability: null }))
        )
      )
    )
  );

  getWmsFeatures = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.getWmsFeatures),
      mergeMap((action) => combineLatest([of(action), this.wmsService.getWmsFeatures(action.url)])),
      map(([action, json]) => {
        return DashboardActions.addWmsFeatures({
          features: json.features.map((feature: any) => {
            const result: any = {
              id: feature.id,
              oClass: action.oClass,
              coordinates: action.coordinates,
              properties: Object.keys(feature.properties)
                .map((property) => ({ key: property, value: feature.properties[property] }))
                .filter((prop) => !!prop.value)
            };
            return result;
          })
        });
      })
    )
  );

  addManifestMetadata = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.addManifestMetadata),
      mergeMap((action) =>
        this.manifestService.addMetadata(action.presentationId, action.metadataId, action.value).pipe(
          map(() => DashboardActions.fetchManifestsList()),
          catchError((error) => {
            if (error.status === 404) {
              this.snackBar.open({
                type: 'error',
                message: this.translateService.instant('@pry.toolbox.manifest.saveErrorCode.SAVE_METADATA', {
                  code: error.status
                })
              });
            }
            return throwError(() => error);
          })
        )
      )
    )
  );

  deleteManifestMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.deleteManifestMetadata),
      mergeMap((action) =>
        this.manifestService
          .deleteMetadata(action.presentationId, action.metadataId)
          .pipe(map(() => DashboardActions.fetchManifestsList()))
      )
    )
  );

  loadPresentation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadPresentation),
      tap(() =>
        this.store.dispatch(
          DashboardActions.updateManifest({
            manifest: { windows: [] },
            selectedIds: []
          })
        )
      ),
      tap((action) =>
        this.store.dispatch(
          DashboardActions.selectPresentation({
            presentation: action.presentation,
            viewMode: action.viewMode
          })
        )
      ),
      tap((action) => this.titleService.changeTitle(action.presentation.name)),
      mergeMap((action) =>
        this.manifestService.get(action.presentation.id).pipe(
          mergeMap((manifest) => [
            DashboardActions.updateManifest({
              manifest,
              selectedIds: [],
              manifestId: action.presentation.id
            }),
            DashboardActions.setInitialPresentation({
              initial: manifest
            }),
            DashboardActions.followManifestRoute()
          ])
        )
      )
    )
  );

  constructor(
    private dashboardInitService: DashboardInitService,
    private actions$: Actions,
    private store: Store<any>,
    private manifestService: ManifestService,
    private itemService: ItemService,
    private titleService: PryTitleService,
    private translateService: PryI18nService,
    private snackBar: PrySnackbarService,
    private router: Router,
    private refreshService: RefreshService,
    private toolboxManifestService: ToolboxManifestService,
    private busService: BusService,
    private searchService: SearchService,
    private pryDialog: PryDialogService,
    private wmsService: WmsService,
    private widgetFactoryService: WidgetFactoryService
  ) {
    dashboardInitService.init();
    refreshService.start();
  }
}
