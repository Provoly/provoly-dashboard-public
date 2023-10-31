import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { DashboardSelectors } from '../../../../dashboard/store/dashboard.selectors';
import { Item, ValueType } from '../../../model/item.interface';
import {
  AtLimit,
  ChartAggregatedWidgetOptions,
  Operation,
  TimeLimit
} from '../../../model/widget-aggregated-chart-manifest.interface';
import { ClassSelectors } from '../../class/class.selectors';
import { AggregationResult, PryAggregationService } from '../base-aggregation.service';
import { AggregationUtils } from './aggregation-utils.class';
import { Class } from '../../class/class.interface';

@Injectable({
  providedIn: 'root'
})
export class PryFrontendAggregationService extends PryAggregationService {
  constructor(private store: Store) {
    super();
  }

  override aggregate(datasources: string[], options: ChartAggregatedWidgetOptions): Observable<AggregationResult> {
    return combineLatest([
      this.store.select(DashboardSelectors.resultSets),
      this.store.select(ClassSelectors.classes),
      this.store.select(DashboardSelectors.filters)
    ]).pipe(
      map(([resultSets, classes, filters]) => {
        const resultSet = AggregationUtils.getChartDatasourceResultSet(datasources, resultSets);
        let items: Item[] = Object.keys(resultSet.items)
          .map((classId) => resultSet.items[classId])
          .reduce((prev, curr) => [...prev, ...curr], []) as Item[];
        items = AggregationUtils.filterItems(items, filters);
        return this.getAggregationResult(options, classes, items);
      })
    );
  }

  getAggregationResult(options: ChartAggregatedWidgetOptions, classes: Class[], items: Item[]): AggregationResult {
    const [abscissa, ordinate] = [
      AggregationUtils.getAxisAttribute(classes, options, 'abscissa') ?? '',
      AggregationUtils.getAxisAttribute(classes, options, 'ordinate') ?? ''
    ];

    const aggregationResult: AggregationResult = {
      operation: options.ordinate.operation,
      values: []
    };

    if (!options.groupBy) {
      if (!!options.ordinate.operation) console.warn('no ordinate operation selected');
      aggregationResult.values = this.getChartDataBasedOnOperation(
        items,
        options.ordinate.operation,
        abscissa,
        ordinate,
        options.abscissa.limit
      );
    } else {
      const groupByAttribute =
        classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options.groupBy?.attribute))
          .find((attr) => !!attr)?.name ?? '';
      const itemsGrouped: { [key: string | number]: Item[] } = this.getItemsGroupedByAttributeValue(
        items,
        groupByAttribute
      );

      aggregationResult.values = Object.keys(itemsGrouped).map((key) => ({
        key,
        groupBy: this.getChartDataBasedOnOperation(
          itemsGrouped[key],
          options.ordinate.operation,
          abscissa,
          ordinate,
          options.abscissa.limit
        )
      }));
    }
    return aggregationResult;
  }

  getItemsGroupedByAttributeValue(items: Item[], attribute: string): { [key: string | number]: Item[] } {
    if (attribute === '') console.warn('groupBy attribute not found');
    let distinctValues: { [key: string | number]: Item[] } = {};
    items.forEach((item: Item) => {
      let value = AggregationUtils.getValueFromAttribute(item, attribute)?.value as string | number;
      if (!!value) distinctValues[value] = [...(distinctValues[value] ?? []), item];
    });
    return distinctValues;
  }

  // get { key, value } object list that will be our data to show in the chart
  getChartDataBasedOnOperation(
    items: Item[],
    operation: Operation,
    abscissa: string,
    ordinate: string,
    limit?: AtLimit | TimeLimit
  ): { key: ValueType; value: ValueType }[] {
    if (abscissa === '' || ordinate === '') console.warn('abscissa or ordinate attribute not found');
    const groupByAbscissa = this.getItemsGroupedByAttributeValue(items, abscissa);
    let result: { key: ValueType; value: ValueType }[] = [
      ...Object.keys(groupByAbscissa).map((abscissaAttribute) => {
        return {
          key: +abscissaAttribute || abscissaAttribute,
          value: AggregationUtils.getAggregatedValue(operation, groupByAbscissa, abscissaAttribute, ordinate ?? '')
        };
      })
    ];

    if (limit) result = AggregationUtils.formatByLimit(result, limit, operation);
    return result;
  }
}
