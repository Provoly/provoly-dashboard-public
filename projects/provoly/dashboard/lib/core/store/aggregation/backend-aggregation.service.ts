import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ChartAggregatedWidgetOptions,
  Class,
  ClassSelectors,
  ConfigSelectors,
  DashboardSelectors,
  DEFAULT_NAMED_QUERY_ID,
  EXPLORE_NAMED_QUERY_ID,
  Field,
  FieldSelectors,
  FilterContext,
  Operation,
  PryI18nService,
  PrySnackbarService,
  ResultSets,
  SearchService
} from '@provoly/dashboard';
import { map, Observable, of, switchMap } from 'rxjs';
import { AggregationResult, PryAggregationService } from './base-aggregation.service';

@Injectable({
  providedIn: 'root'
})
export class PryBackendAggregationService extends PryAggregationService {
  private rs: ResultSets = {};
  private classes: Class[] = [];
  private fields: Field[] = [];
  private filters: { [datasource: string]: FilterContext[] } = {};

  constructor(
    private store: Store,
    private snackBar: PrySnackbarService,
    private translateService: PryI18nService,
    private httpClient: HttpClient,
    private searchService: SearchService
  ) {
    super();

    this.store.select(DashboardSelectors.resultSets).subscribe((rs) => (this.rs = rs as ResultSets));
    this.store.select(ClassSelectors.classes).subscribe((classes) => (this.classes = classes));
    this.store.select(FieldSelectors.fields).subscribe((fields) => (this.fields = fields));
    this.store.select(DashboardSelectors.datasourceFilters).subscribe((filters) => (this.filters = filters));
  }

  override aggregate(datasources: string[], options: ChartAggregatedWidgetOptions): Observable<AggregationResult> {
    const targetDatasource = datasources.find((ds) => ![DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID].includes(ds));

    if (datasources.length > 1) {
      this.snackBar.open({
        type: 'warning',
        message: this.translateService.instant('@pry.message.backend-only-1-datasource'),
        timeout: 4000
      });
    }

    if (datasources.includes(DEFAULT_NAMED_QUERY_ID) || datasources.includes(EXPLORE_NAMED_QUERY_ID)) {
      this.snackBar.open({
        type: 'warning',
        message: this.translateService.instant('@pry.message.cannot-aggregate-virtual-ds'),
        timeout: 4000
      });
    }

    if (!targetDatasource) {
      console.warn('Aggregation needs a target datasource.');
      return of({ operation: options.ordinate.operation, values: [] } as AggregationResult);
    }

    let params = new HttpParams();
    if (options.abscissa && options.abscissa.attribute) {
      params = params.set('aggregatedBy', options.abscissa.attribute);
    } else {
      console.warn('Aggregation needs an aggregatedBy member.');
      if (options.ordinate.operation !== Operation.EXTENT) {
        return of({ operation: options.ordinate.operation, values: [] } as AggregationResult);
      }
    }
    if (options.abscissa && options.abscissa.limit) {
      if (options.abscissa.limit.isTimeLimit) {
        params = params.set('dateInterval', options.abscissa.limit.interval);
      } else {
        params = params.set('interval', options.abscissa.limit.at);
        params = params.set('limitOrder', options.abscissa.limit.order);
        params = params.set('limitOthers', options.abscissa.limit.others);
      }
    }
    const operation = options.ordinate.operation?.replace(/^none$/, Operation.SUM);
    params = params.set('operation', operation);
    if (!!options.ordinate.attribute) {
      params = params.set('valueField', options.ordinate.attribute);
    }
    if (options.groupBy) {
      params = params.set('groupBy', options.groupBy.attribute);
    }
    params = this.searchService.getItemsFilter(targetDatasource, params);

    return this.store.select(ConfigSelectors.dataUrl).pipe(
      switchMap((url) =>
        this.httpClient
          .get<AggregationResult>(`${url}/data-sources/id/${targetDatasource}/items/aggregate`, {
            params
          })
          .pipe(
            map((result) => ({
              ...result,
              operation: options.ordinate.operation === Operation.NONE ? Operation.NONE : result.operation
            }))
          )
      )
    );
  }
}
