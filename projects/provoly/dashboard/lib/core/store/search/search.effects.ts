import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs';
import { DashboardActions } from '../../../dashboard/store/dashboard.actions';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { SearchActions } from './search.actions';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from './search.constants';
import { SearchService } from './search.service';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private searchService: SearchService, private store: Store) {}

  searchNamed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.getDatasourceItems),
      withLatestFrom(this.store.select(DashboardSelectors.rank), this.store.select(DashboardSelectors.quickOrder)),
      filter(([_, rank]) => rank === 0),
      filter(([props, rank]) => props.id !== DEFAULT_NAMED_QUERY_ID && props.id !== EXPLORE_NAMED_QUERY_ID),
      mergeMap(([props, rank, quickOrder]) =>
        this.searchService.getItems(props.id, quickOrder[props.id], props.excludeGeo).pipe(
          map((resultSet) =>
            SearchActions.searchSuccess({
              resultSet,
              id: props.id,
              params: this.searchService.getItemsSerializedParams(props.id, quickOrder)
            })
          ),
          catchError((error) => [SearchActions.searchFailure({ error, id: props.id })])
        )
      )
    )
  );

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.search),
      mergeMap(
        (props: { payload: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload; id?: string }) =>
          this.searchService.search(props.payload).pipe(
            map((resultSet) => SearchActions.searchSuccess({ resultSet, id: props.id })),
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
          params: action.params
        })
      )
    )
  );

  getPossibleFilterValues$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.getPossibleFilterValues),
      mergeMap((action) =>
        this.searchService
          .autocomplete(action.attributes, '', action.limit)
          .pipe(map((values) => SearchActions.setPossibleFilterValues({ filterId: action.filterId, values })))
      )
    )
  );
}
