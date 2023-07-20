// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'date' })
export class MockDatePipe implements PipeTransform {
  transform(value: number, ...args: any[]): number {
    return value;
  }
}
