import { Pipe, PipeTransform } from '@angular/core';

export const LOCALE = {
  value: navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language
};

@Pipe({ name: 'dataFormat' })
export class DataFormatPipe implements PipeTransform {
  constructor() {}

  transform(value?: any, toLocale?: boolean, suffix?: string, dateFormat?: string, ...args: any[]): any {
    let result = value;
    if (toLocale) {
      result = toLocaleString(value);
    }
    if (suffix) {
      result = result + ' ' + suffix;
    }

    if (dateFormat) {
      result = new Intl.DateTimeFormat(
        LOCALE.value,
        dateFormatOptions.value[dateFormat] ?? DEFAULT_DATE_FORMAT.value
      ).format(getDate(value));
    }

    return result;
  }
}

// number formatting methods

const toLocaleString = (value?: string | number) => {
  switch (typeof value) {
    case 'number':
      return new Intl.NumberFormat().format(value);
    case 'string':
      return value;
    default:
      return value;
  }
};

// date formatting methods

export const dateFormatOptions: { value: { [key: string]: Intl.DateTimeFormatOptions } } = {
  value: {
    datetime: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    },
    date: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    monthyear: {
      month: '2-digit',
      year: 'numeric'
    },
    daymonth: {
      month: '2-digit',
      day: '2-digit'
    },
    year: {
      year: 'numeric'
    },
    month: {
      month: '2-digit'
    },
    day: {
      day: '2-digit'
    }
  }
};

export const DEFAULT_DATE_FORMAT = {
  value: 'datetime'
};

const getDate = (value: string | number | Date): Date => {
  if (typeof value === 'string' || typeof value === 'number') {
    return new Date(value);
  }
  return value;
};
