// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'geometryFieldsFor'
})
export class MockGeometryFieldsForPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {}
}
