import { Pipe, PipeTransform } from '@angular/core';
import { FormatOptions } from '@provoly/dashboard';

export const LOCALE = {
  value: navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language
};

@Pipe({ name: 'dataFormat' })
export class DataFormatPipe implements PipeTransform {
  constructor() {}

  transform(
    value: any,
    { localeFormat, unit, decimalPrecision, format }: Partial<FormatOptions> | undefined = {}
  ): any {
    let result = value;

    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    if (decimalPrecision || localeFormat) {
      result = new Intl.NumberFormat(LOCALE.value, {
        // @ts-ignore
        roundingMode: 'floor',
        minimumFractionDigits: decimalPrecision,
        maximumFractionDigits: decimalPrecision,
        useGrouping: localeFormat
      }).format(value);
    }

    if (unit) {
      result = result + ' ' + unit;
    }

    if (format) {
      const actualDate = getDate(value);
      result = new Intl.DateTimeFormat(LOCALE.value, dateFormatOptions.value[format]).format(actualDate);
    }

    return result;
  }
}

// date formatting methods
export const dateFormatOptions: { value: { [key: string]: Intl.DateTimeFormatOptions } } = {
  value: {
    DATETIME: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    DATE: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    },
    MONTH_YEAR: {
      month: '2-digit',
      year: 'numeric'
    },
    DAY_MONTH: {
      month: '2-digit',
      day: '2-digit'
    },
    YEAR: {
      year: 'numeric'
    },
    MONTH: {
      month: '2-digit'
    },
    DAY: {
      day: '2-digit'
    }
  }
};

const getDate = (value: string | number | Date): Date => {
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  return value;
};

export const toD3Format = (format?: string) => {
  switch (format) {
    case 'DATETIME':
      return '%Y-%m-%dT%H:%M:%S';
    case 'DATE':
      return '%Y-%m-%d';
    case 'MONTH_YEAR':
      return '%m-%Y';
    case 'DAY_MONTH':
      return '%d-%m';
    case 'YEAR':
      return '%Y';
    case 'MONTH':
      return '%m';
    case 'DAY':
      return '%d';
    default:
      return '%Y-%B-%dT%H:%M:%S';
  }
};
