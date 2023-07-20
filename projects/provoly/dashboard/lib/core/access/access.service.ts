import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';

export abstract class PryBaseAccess {
  abstract hasRole(...args: any[]): Observable<boolean>;
}

export const PRY_ACCESS_TOKEN = new InjectionToken<PryBaseAccess>('PRY_ACCESS_TOKEN');

@Injectable()
export class PryDefaultAccessService extends PryBaseAccess {
  constructor() {
    super();
  }

  override hasRole(...args: any[]): Observable<boolean> {
    return of(true);
  }
}
