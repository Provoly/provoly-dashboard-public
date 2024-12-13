import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, mergeMap, Observable, of, switchMap, take, withLatestFrom } from 'rxjs';
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
import { FilterParamEncoder } from './filter-param-encoder';
import { DateUtils } from '../../../dashboard/date-utils';
import { NamedQueryTypes } from '../data-source/named-query-types.model';
import { DataSourceSelectors } from '../data-source/data-source.selectors';
import { DataSource } from '../data-source/data-source.model';
import { LinkedItemsOptions } from '../../model/manifest.interface';

export type ResultsetTransformation = (id: string, result: ResultSet) => ResultSet;

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  transformations: ResultsetTransformation[] = [];
  filters: { [datasource: string]: FilterContext[] } = {};
  limits: { [p: string]: number } = {};
  datasources: DataSource[] = [];

  constructor(
    private httpClient: HttpClient,
    private store: Store<ConfigState | SearchState>
  ) {
    store.select(DashboardSelectors.datasourceFilters).subscribe((filters) => {
      this.filters = filters;
    });
    store.select(ConfigSelectors.limits).subscribe((limits) => {
      this.limits = limits;
    });
    store.select(DataSourceSelectors.getDataSources).subscribe((datasources) => {
      this.datasources = datasources;
    });
  }

  getItems(
    id: string,
    quickOrder?: ResultOrder,
    excludeGeo?: boolean,
    searchAfter?: string,
    linkedItems: LinkedItemsOptions = []
  ): Observable<ResultSet> {
    const params = this.getItemsFilter(id, this.getOrder(quickOrder));
    if (!id) {
      console.warn('Not sending items request with no datasource attached.');
      return of({ items: {}, relations: [] } as ResultSet);
    }

    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) => {
        const ds = this.datasources.find((d) => d.id === id);

        const otherParams: { [key: string]: string } = {};
        if (linkedItems.length > 0) {
          if (linkedItems.includes('destination')) {
            otherParams['withDestinationItems'] = 'true';
          }
          if (linkedItems.includes('source')) {
            otherParams['withSourceItems'] = 'true';
          }
        }

        return this.httpClient.post<ResultSet>(
          encodeURI(`${url}/data-sources/id/${id}/items`),
          {
            type: ds?.sourceType === 'namedQuery' ? ds.request.type : NamedQueryTypes.MONO_CLASS,
            excludeGeo: excludeGeo ?? false,
            searchAfter: searchAfter ?? undefined,
            limit: this.limits[id] || this.limits['default'],
            ...otherParams
          },
          { params }
        );
      }),
      map((rs) => this.applyTransformations(id, rs))
    );
  }

  getItemsSerializedParams(
    id: string,
    quickOrder: {
      [id: string]: ResultOrder | undefined;
    } = {},
    excludeGeo: boolean,
    linkedItems?: LinkedItemsOptions
  ): string {
    return `|${this.getItemsFilter(id, this.getOrder(quickOrder[id])).toString()}|${excludeGeo ? 'excludeGeo' : ''}|${linkedItems?.join(',')}|`;
  }

  getItemsFilter(id: string, cumulative?: HttpParams): HttpParams {
    let params = cumulative ?? new HttpParams({ encoder: new FilterParamEncoder() });
    if (this.filters[id]) {
      this.filters[id]
        .filter((filter) => filter.value !== null && filter.value !== undefined)
        .forEach((filter) => {
          let valuesToAddToParams = filter.value;
          // INSIDE and OUTSIDE operators uses 2 values but not sent in an array, values are separated by a coma
          // wich must not be encoded (as if values were in an array)
          const isMultiValued = ['INSIDE', 'OUTSIDE'].find((val) => val === filter.operator) !== undefined;
          if (isMultiValued) {
            valuesToAddToParams = (filter.value as string).split(',');
          }
          // date filter value must be send in ISO-8601 format
          if (filter.type === 'date') {
            valuesToAddToParams = isMultiValued
              ? (valuesToAddToParams as string[]).map((value) => DateUtils.parseToIsoString(value))
              : DateUtils.parseToIsoString(valuesToAddToParams as string);
          }
          const value = Array.isArray(valuesToAddToParams)
            ? valuesToAddToParams.map((v) => encodeURIComponent(v.toString().split(',').join('\\,'))).join(',')
            : encodeURIComponent(valuesToAddToParams!.toString().replace(/,/g, '\\,'));
          params = params.append('filter', `${filter.attribute},${filter.operator},${value}`);
        });
    }
    return params;
  }

  getOrder(quickOrder: ResultOrder | undefined): HttpParams {
    let params = new HttpParams({ encoder: new FilterParamEncoder() });
    if (quickOrder) {
      params = params.append('order', `${quickOrder.attribute},${quickOrder.asc ?? ''}`);
    } else {
      params = params.append('order', 'true,asc');
    }
    return params;
  }

  /**
   * Launch a search request (and saves it as current search)
   * @param condition
   */
  search(
    condition: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload,
    id?: string,
    withLinkedItems: ('destination' | 'source')[] = []
  ): Observable<ResultSet> {
    return this.store.select(ConfigSelectors.dataUrl).pipe(
      filter((url) => !!url),
      take(1),
      withLatestFrom(this.store.select(DashboardSelectors.quickOrder), this.store.select(ConfigSelectors.limits)),
      mergeMap(([url, quickOrder, limits]) => {
        const params = {} as { [key: string]: string };
        if (quickOrder[DEFAULT_NAMED_QUERY_ID]) {
          params['order'] = `${quickOrder[DEFAULT_NAMED_QUERY_ID]?.attribute},${
            quickOrder[DEFAULT_NAMED_QUERY_ID]?.asc ?? ''
          }`;
        }
        const otherParams: { [key: string]: string } = {};
        if (withLinkedItems.length > 0) {
          if (withLinkedItems.includes('destination')) {
            otherParams['withDestinationItems'] = 'true';
          }
          if (withLinkedItems.includes('source')) {
            otherParams['withSourceItems'] = 'true';
          }
        }
        const _condition = { ...condition, limit: limits[DEFAULT_NAMED_QUERY_ID] ?? limits['default'], ...otherParams };
        return this.httpClient.post<ResultSet>(encodeURI(`${url}/items/search`), _condition, { params });
      }),
      map((rs) => this.applyTransformations(id ?? DEFAULT_NAMED_QUERY_ID, rs))
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
          datasource: string;
        }[]
      | undefined,
    search: string = '',
    limit?: number
  ) {
    return this.store.select(ConfigSelectors.dataUrl).pipe(
      switchMap((url) =>
        this.httpClient.post<string[]>(encodeURI(`${url}/data-sources/values`), {
          attributes: (attributes ?? []).map((attr) => ({ datasource: attr.datasource, attribute: attr.id })),
          value: search,
          limit
        })
      )
    );
  }
}
