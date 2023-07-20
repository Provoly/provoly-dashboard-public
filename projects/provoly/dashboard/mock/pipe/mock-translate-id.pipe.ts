// noinspection AngularMissingOrInvalidDeclarationInModule

import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of } from 'rxjs';

@Pipe({ name: 'translateId' })
export class MockTranslateIdPipe implements PipeTransform {
  transform(value: string): Observable<string> {
    return of(value);
  }
}
