import {
  ChartAggregatedWidgetOptions,
  Operation,
  TimeInterval
} from '../../../model/widget-aggregated-chart-manifest.interface';
import { Class } from '../../class/class.interface';
import { Item, ValueType } from '../../../model/item.interface';
import { ResultSets } from '../../../model/result-set.interface';
import { ResultsetUtils } from '../../../../dashboard/resultset-utils';
import { ItemUtils } from '../../../../dashboard/item-utils';
import { Filter } from '../../../model/filter.interface';

export class AggregationUtils {
  static getAxisAttribute(classes: Class[], options: ChartAggregatedWidgetOptions, axis: 'ordinate' | 'abscissa') {
    return classes
      .map((clazz) => clazz.attributes.find((attr) => attr.id === options[axis].attribute))
      .find((attr) => !!attr)?.name;
  }

  static getChartDatasourceResultSet(datasources: string[], resultSets: ResultSets) {
    return datasources
      .filter((rsName) => rsName in resultSets)
      .map((rsName) => resultSets[rsName])
      .reduce((rs1, rs2) => ResultsetUtils.mergeResultSets(rs1, rs2), {
        items: {},
        relations: [],
        merged: datasources.filter((rsName) => rsName in resultSets).length
      });
  }

  static getAggregatedValue(
    operation: Operation,
    groupedItems: { [key: string | number]: Item[] },
    abscissaAttribute: keyof typeof groupedItems,
    ordinateAttribute: string
  ): number | ValueType {
    return this.getAggregatedValueForOperation(
      operation,
      groupedItems[abscissaAttribute].map((item) => this.getValueFromAttribute(item, ordinateAttribute).value as number)
    );
  }

  static getValueFromAttribute(item: Item, attribute: string) {
    let value = ItemUtils.getAttributeValue(item, attribute);
    return Array.isArray(value) ? value[0] : value;
  }

  static getAggregatedValueForOperation(operation: Operation, values: number[]): number | ValueType {
    switch (operation) {
      case Operation.COUNT:
        return values.length;
      case Operation.SUM:
        return values.reduce((acc, val) => acc + val, 0);
      case Operation.DISTINCT:
        return [...new Set(values)].length;
      case Operation.AVERAGE:
        return values.reduce((acc, val) => acc + val, 0) / values.length;
      case Operation.MEDIAN:
        return this.getQuartile(values, 0.5);
      case Operation.Q1:
        return this.getQuartile(values, 0.25);
      case Operation.Q3:
        return this.getQuartile(values, 0.75);
      case Operation.MIN:
        return Math.min(...values);
      case Operation.MAX:
        return Math.max(...values);
      default:
        return -1;
    }
  }

  static getQuartile(values: number[], q: number) {
    if (values.length === 0) return 0;
    values.sort((a: number, b: number) => a - b);

    let pos = (values.length - 1) * q;
    if (pos % 1 === 0) {
      return values[pos];
    }

    pos = Math.floor(pos);
    return values[pos + 1] !== undefined ? (values[pos] + values[pos + 1]) / 2 : values[pos];
  }

  static formatByLimit(
    data: { key: ValueType; value: ValueType }[],
    interval: number | TimeInterval,
    operation: Operation
  ) {
    return typeof interval === 'number' ? data : this.formatDataByTimeLimit(data, interval, operation);
  }

  static formatDataByTimeLimit(
    data: { key: ValueType; value: ValueType }[],
    interval: TimeInterval,
    operation: Operation
  ) {
    let distinctValues: { key: ValueType; values: ValueType[] }[] = [];
    data
      .map((obj) => ({ ...obj, key: this.getKeyValueForTimeInterval(obj.key, interval) }))
      .forEach((obj) => {
        const isNotDistinct = distinctValues.find((distinct) => obj.key === distinct.key);
        if (!!isNotDistinct) {
          isNotDistinct.values.push(obj.value);
        } else {
          distinctValues.push({ key: obj.key, values: [] });
        }
      });
    return distinctValues.map((obj) => ({
      ...obj,
      value: AggregationUtils.getAggregatedValueForOperation(operation, obj.values as number[])
    }));
  }

  static getKeyValueForTimeInterval(key: ValueType, interval: TimeInterval): string {
    const date = new Date(key as string);
    switch (interval) {
      case 'second':
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        ).toISOString();
      case 'minute':
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        ).toISOString();
      case 'hour':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()).toISOString();
      case 'day':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      case 'week':
        const daysToSubtract = (7 + date.getUTCDay()) % 7;
        date.setUTCDate(date.getUTCDate() - daysToSubtract);
        return date.toISOString();
      case 'quarter':
        const quarterStartMonths = [0, 3, 6, 9]; // January, April, July, October
        const quarter = Math.floor(date.getUTCMonth() / 3);
        const year = date.getUTCFullYear();

        const startOfQuarter = new Date(Date.UTC(year, quarterStartMonths[quarter], 1, 0, 0, 0, 0));
        return startOfQuarter.toISOString();
      case 'year':
        return new Date(new Date(key as string).getFullYear(), 0, 1).toISOString();
      default:
        return date.toISOString();
    }
  }

  static filterItems(items: Item[], filters: Filter[]) {
    let filtersByAttribute = filters
      .map((filter) =>
        filter.attributes.map((attribute) => ({
          ...filter,
          attribute: attribute.id,
          attributes: undefined
        }))
      )
      .flat();

    return filters.length > 0
      ? [
          ...new Set(
            filtersByAttribute
              .map((filter) =>
                items.filter((item) =>
                  this.doesItemValuePassFilter(item, filter.attribute, filter.operator, filter.value)
                )
              )
              .flat()
          )
        ]
      : items;
  }

  static doesItemValuePassFilter(
    item: Item,
    attribute: string,
    operator: string | undefined,
    filterValue: string | number | undefined
  ): boolean {
    let value = AggregationUtils.getValueFromAttribute(item, attribute)?.value as string | number;
    let date1: Date, date2: Date;

    switch (operator) {
      case 'EQUALS':
        return value === filterValue;
      case 'NOT_EQUALS':
        return value !== filterValue;
      case 'CONTAINS':
        return (value as string).includes(filterValue as string);
      case 'START_WITH':
        return (value as string).startsWith(filterValue as string);
      case 'END_WITH':
        return (value as string).endsWith(filterValue as string);
      case 'GREATER_THAN':
        if (typeof filterValue === 'number') {
          return (value as number) > filterValue;
        } else if (typeof filterValue === 'string') {
          return new Date(value) > new Date(filterValue);
        } else {
          return false;
        }
      case 'LOWER_THAN':
        if (typeof filterValue === 'number') {
          return (value as number) < filterValue;
        } else if (typeof filterValue === 'string') {
          return new Date(value) < new Date(filterValue);
        } else {
          return false;
        }
      case 'INSIDE':
        [date1, date2] = [
          new Date((filterValue as string).split(',')[0]),
          new Date((filterValue as string).split(',')[1])
        ];
        return new Date(value) > new Date(date1) && new Date(value) < new Date(date2);
      case 'OUTSIDE':
        [date1, date2] = [
          new Date((filterValue as string).split(',')[0]),
          new Date((filterValue as string).split(',')[1])
        ];
        return new Date(value) < new Date(date1) && new Date(value) > new Date(date2);
      default:
        return true;
    }
  }
}
