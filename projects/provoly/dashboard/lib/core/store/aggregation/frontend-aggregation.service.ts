import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { ItemUtils } from '../../../dashboard/item-utils';
import { ResultsetUtils } from '../../../dashboard/resultset-utils';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';
import { Item, ValueType } from '../../model/item.interface';
import {
  AtLimit,
  ChartAggregatedWidgetOptions,
  Operation,
  TimeLimit
} from '../../model/widget-aggregated-chart-manifest.interface';
import { ClassSelectors } from '../class/class.selectors';
import { AggregationResult, PryAggregationService } from './base-aggregation.service';

@Injectable({
  providedIn: 'root'
})
export class PryFrontendAggregationService extends PryAggregationService {
  constructor(private store: Store) {
    super();
  }

  // @ts-ignore
  override aggregate(datasource: string[], options: ChartAggregatedWidgetOptions): Observable<AggregationResult> {
    return combineLatest([
      this.store.select(DashboardSelectors.resultSets),
      this.store.select(ClassSelectors.classes)
    ]).pipe(
      map(([resultSets, classes]) => {
        const abscissa = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options.abscissa.attribute))
          .find((attr) => !!attr)?.name;
        const ordinate = classes
          .map((clazz) => clazz.attributes.find((attr) => attr.id === options.ordinate.attribute))
          .find((attr) => !!attr)?.name;
        if (!abscissa || !ordinate) {
          throw new Error('abscissaorodinateinvalid');
        }
        let data = datasource.map((rsName) => resultSets[rsName ?? '']).filter((rsName) => !!rsName);
        const resultSet = data.reduce((rs1, rs2) => ResultsetUtils.mergeResultSets(rs1, rs2), {
          items: {},
          relations: [],
          merged: data.length
        });
        let items: Item[] = Object.keys(resultSet.items)
          .map((classId) => resultSet.items[classId])
          .reduce((prev, curr) => [...prev, ...curr], []) as Item[];
        if (!!options.groupBy) {
          const groupBy = classes
            .map((clazz) => clazz.attributes.find((attr) => attr.id === options.groupBy?.attribute))
            .find((attr) => !!attr)?.name;
          if (!groupBy) {
            throw new Error('groupByAttributeisinvalid');
          }
          const itemsGrouped: { [key: string | number]: Item[] } = this.groupBy(items, groupBy);
          const values: { key: ValueType; groupBy: {}[] }[] = [];
          Object.keys(itemsGrouped).forEach((key) => {
            values.push({
              key,
              groupBy: this.getValueFromOperation(
                itemsGrouped[key],
                options.ordinate.operation,
                abscissa,
                ordinate,
                options.abscissa.limit
              )
            });
          });
          return { operation: options.ordinate.operation, values: values } as AggregationResult;
        }
        const values = this.getValueFromOperation(
          items,
          options.ordinate.operation,
          abscissa,
          ordinate,
          options.abscissa.limit
        );
        return { operation: options.ordinate.operation, values: values } as AggregationResult;
      })
    );
  }

  getValueFromOperation(
    items: Item[],
    operation: Operation,
    abscissa: string,
    ordinate: string,
    limit?: AtLimit | TimeLimit
  ) {
    let result: { key: ValueType; value: ValueType }[] = [];
    const groupByAbscissa = this.groupBy(items, abscissa);
    groupByAbscissa.map((test: any) => console.log(groupByAbscissa[test]));
    switch (operation) {
      case Operation.COUNT:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: groupByAbscissa[key].length
          }))
        );
        break;
      case Operation.SUM:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getSum(groupByAbscissa[key], ordinate)
          }))
        );
        break;
      case Operation.DISTINCT:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getDistinct(groupByAbscissa[key], ordinate)
          }))
        );
        break;
      case Operation.AVERAGE:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getAverage(groupByAbscissa[key], ordinate)
          }))
        );
        break;
      case Operation.MEDIAN:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getQuartile(groupByAbscissa[key], ordinate, 0.5)
          }))
        );
        break;
      case Operation.Q1:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getQuartile(groupByAbscissa[key], ordinate, 0.25)
          }))
        );
        break;
      case Operation.Q3:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getQuartile(groupByAbscissa[key], ordinate, 0.75)
          }))
        );
        break;
      case Operation.MIN:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getMin(groupByAbscissa[key], ordinate)
          }))
        );
        break;
      default:
        result.push(
          ...Object.keys(groupByAbscissa).map((key) => ({
            key: key,
            value: this.getMax(groupByAbscissa[key], ordinate)
          }))
        );
        break;
    }
    if (limit) {
      result = this.formatByLimit(result, limit);
    }
    return result;
  }

  groupBy(items: Item[], attribute: string) {
    let distincts: any = [];
    items.forEach((item: Item) => {
      let value = this.getValueFromAttribute(item, attribute);
      if (distincts[value.value as string | number]) {
        distincts[value.value as string | number].push(item);
      } else {
        distincts[value.value as string | number] = [item];
      }
    });
    return distincts;
  }

  getValueFromAttribute(item: Item, attribute: string) {
    let value = ItemUtils.getAttributeValue(item, attribute);
    return Array.isArray(value) ? value[0] : value;
  }

  getSum(items: Item[], attribute: string) {
    let sum: number = 0;
    items.forEach((item) => {
      sum += this.getValueFromAttribute(item, attribute).value as number;
    });
    return sum;
  }

  getMin(items: Item[], attribute: string) {
    const result = items.reduce((prev: any, curr: any) => {
      const prevValue = this.getValueFromAttribute(prev, attribute).value;
      const currValue = this.getValueFromAttribute(curr, attribute).value;
      return prevValue < currValue ? prev : curr;
    });
    return this.getValueFromAttribute(result, attribute).value;
  }

  getMax(items: Item[], attribute: string) {
    const result = items.reduce((prev: any, curr: any) => {
      const prevValue = this.getValueFromAttribute(prev, attribute).value;
      const currValue = this.getValueFromAttribute(curr, attribute).value;
      return prevValue > currValue ? prev : curr;
    });
    return this.getValueFromAttribute(result, attribute).value;
  }

  getAverage(items: Item[], attribute: string) {
    const allValues = items.map((item) => this.getValueFromAttribute(item, attribute).value as number);
    return allValues.reduce((acc, val) => acc + val, 0) / allValues.length;
  }

  getDistinct(items: Item[], attribute: string) {
    return [...new Set(items.map((item) => this.getValueFromAttribute(item, attribute).value))].length;
  }

  getQuartile(items: Item[], attribute: string, q: number) {
    const allValues = items.map((item) => this.getValueFromAttribute(item, attribute).value as number);
    const allValuesSorted = allValues.sort((a: number, b: number) => a - b);

    let pos = (allValuesSorted.length - 1) * q;
    if (pos % 1 === 0) {
      return allValuesSorted[pos];
    }

    pos = Math.floor(pos);
    if (allValuesSorted[pos + 1] !== undefined) {
      return (allValuesSorted[pos] + allValuesSorted[pos + 1]) / 2;
    }

    return allValuesSorted[pos];
  }

  getPercentile(items: Item[], attribute: string, q: number) {
    const allValues = items.map((item) => this.getValueFromAttribute(item, attribute).value as number);
    const allValuesSorted = allValues.sort((a: number, b: number) => a - b);
    return (
      (100 * allValuesSorted.reduce((acc, v) => acc + (v < q ? 1 : 0) + (v === q ? 0.5 : 0), 0)) /
      allValuesSorted.length
    );
  }

  formatByLimit(data: { key: ValueType; value: ValueType }[], limit: AtLimit | TimeLimit) {
    if (!limit.isTimeLimit) {
      data
        .sort((a, b) => (limit.order === 'asc' ? (a.value > b.value ? 1 : -1) : a.value < b.value ? 1 : -1))
        .splice(limit.at);
      return data;
    }
    return data;
  }
}
