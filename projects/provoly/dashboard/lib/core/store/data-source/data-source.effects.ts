import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { debounceTime, filter, map, mergeMap, switchMap, tap } from 'rxjs';
import { catchError, withLatestFrom } from 'rxjs/operators';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';
import { PryDialogConfirmComponent, PryDialogConfirmData } from '../../components/overlay/dialog-confirm.component';
import { PryDialogService } from '../../components/overlay/dialog.service';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { ConfigSelectors } from '../config/config.selectors';
import { SearchActions } from '../search/search.actions';
import { SearchService } from '../search/search.service';
import { DataSourceActions } from './data-source.actions';
import { NamedQuery } from './data-source.model';
import { DataSourceSelectors } from './data-source.selectors';
import { DataSourceService } from './data-source.service';

@Injectable()
export class DataSourceEffects {
  private idNamedQuery?: string;

  constructor(
    private actions$: Actions,
    private searchService: SearchService,
    private dataSourceService: DataSourceService,
    private snackBar: PrySnackbarService,
    private translate: PryI18nService,
    private store: Store,
    private pryDialog: PryDialogService
  ) {}

  postNameQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.post),
      withLatestFrom(this.store.select(ConfigSelectors.randomColor)),
      switchMap(([action, randomColor]) => {
        const { name, id, payload, description, color, favorite, isEdit, visibility } = action;
        this.idNamedQuery = isEdit ? id : undefined;
        const namedQuery: NamedQuery = {
          id: id ?? '',
          sourceType: 'namedQuery',
          name,
          description: description ?? undefined,
          visibility: visibility ?? undefined,
          request: payload,
          color: color ?? randomColor,
          favorite
        };
        return this.dataSourceService.post(namedQuery);
      }),
      mergeMap(() => {
        const actions = [] as Action[];
        if (this.idNamedQuery) {
          actions.push(
            SearchActions.getDatasourceItems({ id: this.idNamedQuery, excludeGeo: false, from: 'postNameQuery$' })
          );
        }
        this.idNamedQuery = undefined;
        actions.push(DataSourceActions.namedQuery.load());
        return actions;
      }),
      catchError((error) => [DataSourceActions.namedQuery.failure({ error })])
    )
  );

  getNamedQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.load),
      debounceTime(100),
      switchMap(() => this.dataSourceService.get()),
      map((namedQueryList: NamedQuery[]) => DataSourceActions.namedQuery.loaded({ list: namedQueryList })),
      catchError((error) => [DataSourceActions.namedQuery.failure({ error })])
    )
  );

  loaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.loaded),
      map((action: { list: NamedQuery[]; type: string }) => {
        return DashboardActions.setAvailableNamedQueries({ names: action.list.map((nq) => nq.id) });
      })
    )
  );

  deleteNamedQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.delete),
      switchMap((props: { id: string }) =>
        this.dataSourceService.delete(props.id).pipe(
          mergeMap(() => [DataSourceActions.namedQuery.load()]),
          catchError((error) => [DataSourceActions.namedQuery.failure({ error })])
        )
      )
    )
  );

  addFavoriteNamedQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.addFavorite),
      switchMap((props: { id: string }) => this.dataSourceService.addFavorite(props.id)),
      mergeMap(() => [DataSourceActions.namedQuery.load()]),
      catchError((error) => [DataSourceActions.namedQuery.failure({ error })])
    )
  );

  deleteFavoriteNamedQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.deleteFavorite),
      switchMap((props: { id: string }) => this.dataSourceService.deleteFavorite(props.id)),
      mergeMap(() => [DataSourceActions.namedQuery.load()]),
      catchError((error) => [DataSourceActions.namedQuery.failure({ error })])
    )
  );

  tryEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.edit),
      withLatestFrom(this.store.select(DataSourceSelectors.editInProgress)),
      map(([action, inProgress]) => {
        if (!inProgress) {
          return DataSourceActions.namedQuery.openEdit(action);
        } else {
          this.snackBar.open({
            message: this.translate.instant('@pry.search.namedQuery.alreadyEditing'),
            type: 'error'
          });
          return DataSourceActions.namedQuery.failure({ error: new Error('@pry.search.namedQuery.alreadyEditing') });
        }
      }),
      catchError((error) => [DataSourceActions.namedQuery.failure({ error })])
    )
  );

  updateWidgetAfterSave$ = createEffect(() =>
    this.actions$.pipe(
      // Using strings to prevent having core module depending on search module
      ofType('[SearchMonoClass] save', '[SearchMultiClass] launch save', '[Search Fulltext] save'),
      withLatestFrom(
        this.store.select(DataSourceSelectors.editFromWidget),
        this.store.select(DataSourceSelectors.currentEdit),
        this.store.select(DashboardSelectors.windowManifest)
      ),
      filter(([action, fromWidget, currentEdit, windowManifest]) => fromWidget !== undefined),
      map(([action, fromWidget, currentEdit, windowManifest]) => {
        const widgetManifestCopy = structuredClone(windowManifest.widgets[fromWidget?.widgetIndex ?? 0]);
        // Replacing updated query id by new query id
        const arrayOfdatasource = Array.isArray(widgetManifestCopy.datasource)
          ? widgetManifestCopy.datasource
          : ([widgetManifestCopy.datasource].filter((d) => d) as string[]);

        // @ts-ignore : we don't want to make core depending on search
        const newQueryId = action.id;
        const previousNqIndex = arrayOfdatasource.indexOf(fromWidget?.editedQuery ?? '');
        if (previousNqIndex >= 0) {
          arrayOfdatasource[previousNqIndex] = newQueryId;
        } else {
          // Editing a request that's not in the widget. Adding it
          arrayOfdatasource.push(newQueryId);
        }
        widgetManifestCopy.datasource = arrayOfdatasource;

        return DashboardActions.updateWidgetManifest({
          index: fromWidget?.widgetIndex ?? 0,
          manifest: widgetManifestCopy
        });
      })
    )
  );

  loadedDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.loadDataset),
      mergeMap((action) =>
        this.dataSourceService
          .getDatasets()
          .pipe(map((dsd) => DataSourceActions.dataset.loadedDataset({ datasets: dsd })))
      )
    )
  );

  loadDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.load),
      debounceTime(100),
      mergeMap((action) => [DataSourceActions.namedQuery.load(), DataSourceActions.dataset.loadDataset()])
    )
  );

  listVersions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.listVersions),
      switchMap((action) =>
        this.dataSourceService.getDatasetVersions(action).pipe(
          map((response) =>
            DataSourceActions.dataset.listVersionsSuccess({
              versions: response.body ?? [],
              totalVersionCount: +(response.headers.get('x-total-count') ?? 0)
            })
          ),
          catchError((_) => [DataSourceActions.dataset.listVersionsFailure()])
        )
      )
    )
  );

  listVersionsById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.listVersionsByDatasetId),
      switchMap((action) =>
        this.dataSourceService.getDatasetVersionsById(action.id).pipe(
          map((versions) => DataSourceActions.dataset.updateVersionList({ id: action.id, versions })),
          catchError((_) => [DataSourceActions.dataset.listVersionsFailure()])
        )
      )
    )
  );

  deactivateDatasetVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.deactivateDatasetVersion),
      switchMap((action: any) =>
        this.dataSourceService.deactivateDatasetVersion(action.versionId).pipe(
          map(() => DataSourceActions.dataset.deactivateDatasetVersionSuccess({ datasetId: action.datasetId })),
          catchError((error) => [DataSourceActions.dataset.deactivateDatasetVersionFailure({ error })])
        )
      )
    )
  );

  activateDatasetVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.activateDatasetVersion),
      switchMap((action: any) =>
        this.dataSourceService.activateDatasetVersion(action.versionId).pipe(
          map(() => DataSourceActions.dataset.activateDatasetVersionSuccess({ datasetId: action.datasetId })),
          catchError((error) => [DataSourceActions.dataset.activateDatasetVersionFailure({ error })])
        )
      )
    )
  );

  activateOrDeactivateDatasetVersionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        DataSourceActions.dataset.activateDatasetVersionSuccess,
        DataSourceActions.dataset.deactivateDatasetVersionSuccess
      ),
      map((action) => {
        this.store.dispatch(DataSourceActions.dataset.loadDataset());
        return DataSourceActions.dataset.listVersionsByDatasetId({ id: action.datasetId });
      })
    )
  );

  previewsGetById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.previews.getById),
      switchMap((action: any) =>
        this.dataSourceService.getPreviews(action.id).pipe(
          map((previews) => DataSourceActions.dataset.previews.getByIdSuccess({ previews })),
          catchError((error) => [DataSourceActions.dataset.previews.getByIdFailure({ error })])
        )
      )
    )
  );

  updateDatasetVersionInfo = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.updateDatasetVersionInfo),
      switchMap((action) =>
        this.dataSourceService
          .updateDatasetVersionInfo(action.version)
          .pipe(
            map((previews) => DataSourceActions.dataset.updateDatasetVersionInfoSuccess({ version: action.version }))
          )
      )
    )
  );

  confirmDeleteDatasetVersion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DataSourceActions.dataset.confirmDeleteVersion),
        tap((action) => {
          const data: PryDialogConfirmData = {
            title: '@pry.dataset.version.delete.title',
            message: '@pry.dataset.version.delete.message',
            actions: [
              {
                id: 0,
                label: '@pry.dataset.buttonAction.delete',
                actions: [DataSourceActions.dataset.deleteVersion({ version: action.version })]
              },
              {
                id: 1,
                label: '@pry.dataset.buttonAction.cancel',
                color: 'secondary'
              }
            ]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
        })
      ),
    { dispatch: false }
  );

  deleteDatasetVersion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.deleteVersion),
      switchMap((action) =>
        this.dataSourceService.deleteDatasetVersion(action.version).pipe(
          mergeMap(() => [DataSourceActions.dataset.listVersionsByDatasetId({ id: action.version.dataset.id })]),
          catchError((err) => [DataSourceActions.dataset.deleteVersionFailure({ err })])
        )
      )
    )
  );

  getCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.dataset.getCategories),
      mergeMap((action) =>
        this.dataSourceService
          .getCategories()
          .pipe(map((categories) => DataSourceActions.dataset.getCategoriesSuccess({ categories })))
      )
    )
  );
}
