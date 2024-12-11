import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, debounceTime, EMPTY, filter, groupBy, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { SearchActions } from './search.actions';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from './search.constants';
import { SearchService } from './search.service';
import { WidgetFactoryService } from '../../../dashboard/components/widgets/widget-instanciator/widget-factory.service';
import { WidgetManifest } from '../../model/manifest.interface';
import { SearchSelectors } from './search.selectors';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private searchService: SearchService,
    private store: Store,
    private widgetFactoryService: WidgetFactoryService
  ) {}

  searchNamed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.getDatasourceItems),
      withLatestFrom(
        this.store.select(DashboardSelectors.rank),
        this.store.select(DashboardSelectors.quickOrder),
        this.store.select(DashboardSelectors.resultSets)
      ),
      filter(([_, rank]) => rank === 0),
      filter(([props, rank]) => props.id !== DEFAULT_NAMED_QUERY_ID && props.id !== EXPLORE_NAMED_QUERY_ID),
      groupBy(([props, rank, quickOrder, rs]) => props.id),
      mergeMap((group$) =>
        group$.pipe(
          debounceTime(100),
          switchMap(([props, rank, quickOrder, rs]) =>
            this.searchService
              .getItems(
                props.id,
                quickOrder[props.id],
                props.excludeGeo,
                props.next ? rs[props.id].searchAfter : undefined,
                props.linkedItems
              )
              .pipe(
                map((resultSet) =>
                  SearchActions.searchSuccess({
                    resultSet,
                    id: props.id,
                    params: this.searchService.getItemsSerializedParams(
                      props.id,
                      quickOrder,
                      props.excludeGeo,
                      props.linkedItems
                    ),
                    next: props.next
                  })
                ),
                catchError((error) => [SearchActions.searchFailure({ error, id: props.id })])
              )
          )
        )
      )
    )
  );

  fetchMore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.fetchMoreItems),
      withLatestFrom(this.store.select(DashboardSelectors.rank), this.store.select(DashboardSelectors.resultSets)),
      filter(([props, rank, rs]) => rank === 0 && !!rs[props.id].searchAfter),
      debounceTime(300),
      mergeMap(([props]) => {
        const ds = this.widgetFactoryService.datasourcesToAutoLoad({
          type: props.widgetType,
          datasource: [props.id]
        } as WidgetManifest)[0];

        if (!!ds) {
          return of(
            SearchActions.getDatasourceItems({
              id: ds.datasetId,
              excludeGeo: ds.excludeGeo,
              from: 'fetchMore',
              next: true
            })
          );
        } else {
          return EMPTY;
        }
      })
    )
  );

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.search),
      mergeMap(
        (props: {
          payload: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload;
          id?: string;
          linkedItems?: ('destination' | 'source')[];
        }) =>
          this.searchService.search(props.payload, props.id, props.linkedItems).pipe(
            map((resultSet) => {
              return SearchActions.searchSuccess({ resultSet, id: props.id });
            }),
            catchError((error) => [SearchActions.searchFailure({ error, id: props.id })])
          )
      )
    )
  );

  searchSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.searchSuccess),
      map((action) =>
        DashboardActions.updateResultSet({
          id: action.id ?? DEFAULT_NAMED_QUERY_ID,
          resultSet: action.resultSet,
          params: action.params,
          next: action.next
        })
      )
    )
  );

  getPossibleFilterValues$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.getPossibleFilterValues),
      withLatestFrom(this.store.select(SearchSelectors.filterValues), this.store.select(DashboardSelectors.rank)),
      filter(
        ([action, filterValues, rank]) =>
          (action.force || !filterValues[action.filterId] || filterValues[action.filterId].length === 0) && rank === 0
      ),
      mergeMap(([action]) =>
        this.searchService
          .autocomplete(action.attributes, '', action.limit)
          .pipe(map((values) => SearchActions.setPossibleFilterValues({ filterId: action.filterId, values })))
      )
    )
  );
}
