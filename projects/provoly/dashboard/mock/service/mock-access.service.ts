import { PryBaseAccess } from '@provoly/dashboard';
import { Observable, of } from 'rxjs';

export class MockAccessService implements PryBaseAccess {
  hasRole(...args: any[]): Observable<boolean> {
    const value = args[1] === 'module';
    return of(value);
  }

  canModifyPresentation(): Observable<boolean> {
    return of(true);
  }

  hasGroup(): Observable<boolean> {
    return of(true);
  }

  canModifyDataset(): Observable<boolean> {
    return of(true);
  }

  canModifyWidget(): Observable<boolean> {
    return of(true);
  }
}
