// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'prySortData' })
export class MockSortPipe implements PipeTransform {
  transform(value: number, ...args: any[]): number {
    return value;
  }
}
