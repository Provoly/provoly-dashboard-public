// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dataFormat' })
export class MockDataFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    return value;
  }
}
