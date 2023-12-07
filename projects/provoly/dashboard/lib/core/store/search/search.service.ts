import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';
import { FilterContext } from '../../model/filter.interface';
import { ResultOrder } from '../../model/result-order.interface';
import { ResultSet } from '../../model/result-set.interface';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { ConfigState } from '../config/config.reducer';
import { ConfigSelectors } from '../config/config.selectors';
import { DEFAULT_NAMED_QUERY_ID } from './search.constants';
import { SearchState } from './search.reducer';

export type ResultsetTransformation = (id: string, result: ResultSet) => ResultSet;

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  transformations: ResultsetTransformation[] = [];
  filters: { [datasource: string]: FilterContext[] } = {};

  constructor(private httpClient: HttpClient, private store: Store<ConfigState | SearchState>) {
    store.select(DashboardSelectors.datasourceFilters).subscribe((filters) => {
      this.filters = filters;
    });
  }

  getItems(id: string, quickOrder?: ResultOrder, excludeGeo?: boolean): Observable<ResultSet> {
    const params = this.getItemsFilter(id, this.getOrder(quickOrder)).append(
      'excludeGeo',
      false /* TODO: when backend will have fixed #52: excludeGeo ?? false */
    );

    if (!id) {
      console.warn('Not sending items request with no datasource attached.');
      return of({ items: {}, relations: [] } as ResultSet);
    }

    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) => this.httpClient.get<ResultSet>(encodeURI(`${url}/data-sources/id/${id}/items`), { params })),
      map((rs) => this.applyTransformations('current', rs))
    );
  }

  getItemsSerializedParams(id: string, quickOrder: { [id: string]: ResultOrder | undefined } = {}): string {
    return '|' + this.getItemsFilter(id, this.getOrder(quickOrder[id])).toString() + '|';
  }

  getItemsFilter(id: string, cumulative?: HttpParams): HttpParams {
    let params = cumulative ?? new HttpParams();
    if (this.filters[id]) {
      this.filters[id]
        .filter((filter) => filter.value !== null && filter.value !== undefined)
        .forEach((filter) => {
          params = params.append('filter', `${filter.attribute},${filter.operator},${filter.value}`);
        });
    }
    return params;
  }

  getOrder(quickOrder: ResultOrder | undefined, cumulative?: HttpParams): HttpParams {
    let params = cumulative ?? new HttpParams();
    if (quickOrder) {
      params = params.append('order', `${quickOrder.attribute},${quickOrder.asc ?? ''}`);
    }
    return params;
  }

  /**
   * Launch a search request (and saves it as current search)
   * @param condition
   */
  search(condition: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload): Observable<ResultSet> {
    return combineLatest([
      this.store.select(ConfigSelectors.dataUrl),
      this.store.select(DashboardSelectors.quickOrder)
    ]).pipe(
      mergeMap(([url, quickOrder]) => {
        const params = {} as { [key: string]: string };
        if (quickOrder[DEFAULT_NAMED_QUERY_ID]) {
          params['order'] = `${quickOrder[DEFAULT_NAMED_QUERY_ID]?.attribute},${
            quickOrder[DEFAULT_NAMED_QUERY_ID]?.asc ?? ''
          }`;
        }
        return this.httpClient.post<ResultSet>(encodeURI(`${url}/items/search`), condition, { params });
      }),
      map((rs) => this.applyTransformations(DEFAULT_NAMED_QUERY_ID, rs))
    );
  }

  /**
   * Allows to add a transformation function when getting results from backend
   * @param func
   */
  addTransformation(func: ResultsetTransformation) {
    this.transformations.push(func);
  }

  /**
   * Apply all transformation functions
   * @param id
   * @param rs
   */
  applyTransformations(id: string, rs: ResultSet) {
    let transformed = rs;
    this.transformations.forEach((func) => (transformed = func(id, transformed)));
    return transformed;
  }

  autocomplete(
    attributes:
      | {
          id: string;
          name: string;
          label: string;
          datasource: string;
        }[]
      | undefined,
    search: string,
    limit = 10
  ) {
    return this.store.select(ConfigSelectors.dataUrl).pipe(
      switchMap((url) =>
        this.httpClient.post<string[]>(encodeURI(`${url}/data-sources/search`), {
          datasourceByAttribute: (attributes ?? [])
            .map((attr) => ({ [attr.id]: attr.datasource }))
            .reduce((p, c) => ({ ...p, ...c }), {}),
          value: search,
          limit
        })
      )
    );
  }
}
