import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, of, share } from 'rxjs';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { FilterContext } from '../../model/filter.interface';
import { ResultSets } from '../../model/result-set.interface';
import { ChartAggregatedWidgetOptions, Operation } from '../../model/widget-aggregated-chart-manifest.interface';
import { Class } from '../class/class.interface';
import { ClassSelectors } from '../class/class.selectors';
import { ConfigSelectors } from '../config/config.selectors';
import { Field } from '../field/field.interface';
import { FieldSelectors } from '../field/field.selectors';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from '../search/search.constants';
import { SearchService } from '../search/search.service';
import { AggregationResult, PryAggregationService } from './base-aggregation.service';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PryBackendAggregationService extends PryAggregationService {
  private rs: ResultSets = {};
  private classes: Class[] = [];
  private fields: Field[] = [];
  private filters: { [datasource: string]: FilterContext[] } = {};
  private dataUrl: string = '';

  private cache: {
    [key: string]: {
      response: Observable<AggregationResult>;
      time: number;
    };
  } = {};

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
    this.store.select(ConfigSelectors.dataUrl).subscribe((dataUrl) => (this.dataUrl = dataUrl));
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
      return of({ operation: options.ordinate?.operation ?? 'none', values: [] } as AggregationResult);
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
    if (options.graph.sort) {
      params = params.set(
        'sort',
        `${options.graph.sort.direction},${
          options.graph.sort.attribute === options.abscissa.attribute ? 'KEY' : 'VALUE'
        }`
      );
    }
    params = this.searchService.getItemsFilter(targetDatasource, params);

    const key = `${this.dataUrl}_${params.toString()}`;
    if (!this.cache[key] || this.cache[key].time + 1000 < new Date().getTime()) {
      this.cache[key] = {
        response: this.httpClient
          .get<AggregationResult>(`${this.dataUrl}/data-sources/id/${targetDatasource}/items/aggregate`, {
            params
          })
          .pipe(
            debounceTime(100),
            map((result) => ({
              ...result,
              operation: options.ordinate.operation === Operation.NONE ? Operation.NONE : result.operation
            })),
            share()
          ),
        time: new Date().getTime()
      };
    }
    return this.cache[key].response;
  }
}
