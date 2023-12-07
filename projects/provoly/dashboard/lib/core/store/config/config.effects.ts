import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, throwError } from 'rxjs';
import { filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { PryDialogConfirmComponent, PryDialogConfirmData } from '../../components/overlay/dialog-confirm.component';
import { PryDialogService } from '../../components/overlay/dialog.service';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { ConfigActions } from './config.actions';
import { ConfigSelectors } from './config.selectors';
import {
  ConfigService,
  FILTERS_DOMAIN,
  SYMBOL_DOMAIN,
  TABLE_ATTR_DOMAIN,
  TILE_ATTR_DOMAIN,
  TOOLTIPS_DOMAIN
} from './config.service';
import { ChartOptionDefault } from './config.widget.constants';
import { OpenMapTilesService } from './open-map-tiles.service';
import { Versions } from './versions.interface';

@Injectable()
export class ConfigEffects {
  mapStyles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.getMapStyles),
      withLatestFrom(this.store.select(ConfigSelectors.mapStyles)),
      filter(([action, mapStyles]) => !mapStyles || mapStyles.length === 0),
      mergeMap(([action]) =>
        this.openMapTilesService.getStyles().pipe(map((styles) => ConfigActions.defineMapStyles({ styles })))
      )
    )
  );

  saveIconDefinitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.saveIcons),
      mergeMap((action) =>
        this.configService
          .saveDefinitions(action.definitions, SYMBOL_DOMAIN)
          .pipe(map(() => ConfigActions.loadCustomization()))
      )
    )
  );

  saveTableAttributes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.saveTableDefaultAttributes),
      mergeMap((action) =>
        this.configService
          .saveDefinitions(action.definitions, TABLE_ATTR_DOMAIN)
          .pipe(map(() => ConfigActions.loadCustomization()))
      )
    )
  );

  saveTileAttributes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.saveTileAttributes),
      mergeMap((action) =>
        this.configService
          .saveDefinitions(action.definitions, TILE_ATTR_DOMAIN)
          .pipe(map(() => ConfigActions.loadCustomization()))
      )
    )
  );

  saveTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.saveTooltip),
      mergeMap((action) =>
        this.configService
          .saveDefinitions(action.definitions, TOOLTIPS_DOMAIN)
          .pipe(map(() => ConfigActions.loadCustomization()))
      )
    )
  );

  getCustomization$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadCustomization),
      debounceTime(100),
      mergeMap((action) =>
        this.configService.getAllClassParams().pipe(
          mergeMap((allDefinitions) => {
            const icons = allDefinitions
              .filter((def) => def.domain === SYMBOL_DOMAIN)
              .reduce(
                (p, c) => ({
                  ...p,
                  [c.oClass]: JSON.parse(c.content)
                }),
                {}
              );
            const tableAttributes = allDefinitions
              .filter((def) => def.domain === TABLE_ATTR_DOMAIN)
              .reduce(
                (p, c) => ({
                  ...p,
                  [c.oClass]: JSON.parse(c.content)
                }),
                {}
              );
            const tooltips = allDefinitions
              .filter((def) => def.domain === TOOLTIPS_DOMAIN)
              .reduce(
                (p, c) => ({
                  ...p,
                  [c.oClass]: JSON.parse(c.content)
                }),
                {}
              );
            const filters = allDefinitions
              .filter((def) => def.domain === FILTERS_DOMAIN)
              .reduce(
                (p, c) => ({
                  ...p,
                  [c.oClass]: JSON.parse(c.content)
                }),
                {}
              );
            const tileAttributes = allDefinitions
              .filter((def) => def.domain === TILE_ATTR_DOMAIN)
              .reduce(
                (p, c) => ({
                  ...p,
                  [c.oClass]: JSON.parse(c.content)
                }),
                {}
              );

            return [ConfigActions.loadedCustomization({ icons, tableAttributes, tooltips, filters, tileAttributes })];
          })
        )
      )
    )
  );

  saveWidget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.saveWidget),
      mergeMap((action) =>
        this.configService.saveWidget(action.widget).pipe(
          tap(() =>
            this.snackBar.open({
              message: this.translateService.instant('@pry.toolbox.catalog.saved', { viewId: action.widget.name }),
              type: 'success'
            })
          ),
          map(() => ConfigActions.loadWidgets()),
          catchError((error) => {
            this.snackBar.open({
              message: this.translateService.instant(
                '@pry.toolbox.catalog.saveErrorCode.' + +(error.error?.code ?? 'UNKNOWN'),
                {
                  name: action.widget.name
                }
              ),
              type: 'error'
            });
            return throwError(error);
          })
        )
      )
    )
  );

  confirmRestitutionDeletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ConfigActions.confirmRestitutionDeletion),
        tap((action) => {
          const data: PryDialogConfirmData = {
            title: '@pry.widget.modalTitle',
            actions: [
              {
                id: 0,
                label: '@pry.toolbox.manifest.validate',
                actions: [ConfigActions.deleteRestitution({ id: action.id })]
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

  deleteRestitution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.deleteRestitution),
      mergeMap((action) => this.configService.deleteRestitution(action.id).pipe(map(() => ConfigActions.loadWidgets())))
    )
  );

  loadWidget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadWidgets),
      mergeMap((action) =>
        this.configService.getAllWidgets().pipe(map((widgets) => ConfigActions.loadedWidgets({ widgets })))
      )
    )
  );

  loadChartOption$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadChartOption),
      withLatestFrom(this.store.select(ConfigSelectors.chartOption)),
      map(([action, chartOptions]) => {
        const chartOption = {
          type: chartOptions.type ?? ChartOptionDefault.type,
          subType: chartOptions.subType ?? ChartOptionDefault.subType,
          aggregation: chartOptions.aggregation ?? ChartOptionDefault.aggregation,
          color: chartOptions.color ?? ChartOptionDefault.color
        };
        return ConfigActions.loadedChartOption({ chartOption });
      })
    )
  );
  loadVersions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.loadVersions),
      mergeMap((action) =>
        this.configService.getAllVersions().pipe(
          map((versionsData: Versions) => {
            return ConfigActions.loadVersionsSuccess({ versions: versionsData });
          }),
          catchError((error) => [ConfigActions.loadVersionsFailure({ error: error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private openMapTilesService: OpenMapTilesService,
    private store: Store,
    private configService: ConfigService,
    private snackBar: PrySnackbarService,
    private translateService: PryI18nService,
    private pryDialog: PryDialogService
  ) {}
}
