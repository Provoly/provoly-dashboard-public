// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'number' })
export class MockDecimalPipe implements PipeTransform {
  transform(value: number, ...args: any[]): string {
    return ((value + '').split(/(?=(?:...)*$)/) ?? []).join(',');
  }
}
