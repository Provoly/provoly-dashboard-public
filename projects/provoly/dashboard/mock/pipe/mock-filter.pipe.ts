// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pryFilter' })
export class MockFilterPipe implements PipeTransform {
  transform(value: number, ...args: any[]): number {
    return value;
  }
}
