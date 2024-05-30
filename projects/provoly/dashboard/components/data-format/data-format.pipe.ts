import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dataFormat' })
export class DataFormatPipe implements PipeTransform {
  constructor() {}

  transform(value?: any, toLocale?: boolean, suffix?: string, ...args: any[]): any {
    let result = value;
    if (toLocale) {
      result = toLocaleString(value);
    }
    if (suffix) {
      result = result + ' ' + suffix;
    }

    return result;
  }
}

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
