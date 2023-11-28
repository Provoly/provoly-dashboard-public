import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'localizedNumber' })
export class LocalizedNumberPipe implements PipeTransform {
  constructor() {}

  transform(value: string, ...args: any[]): string {
    return parseFloat(value).toLocaleString();
  }
}
