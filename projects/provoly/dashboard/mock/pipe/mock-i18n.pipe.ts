// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'i18n' })
export class MockI18nPipe implements PipeTransform {
  transform(value: number, ...args: any[]): number {
    return value;
  }
}
