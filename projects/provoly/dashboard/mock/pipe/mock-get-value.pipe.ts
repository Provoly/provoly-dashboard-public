// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Item } from '../../lib/core/model/item.interface';

@Pipe({ name: 'getValue' })
export class MockGetValuePipe implements PipeTransform {
  constructor(private store: Store<any>) {}

  transform(value: Item, ...args: any[]): any {
    return of('4.3');
  }
}
