import { Injectable, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ManifestDescription } from '../model/manifest.interface';
import { Dataset } from '../store/data-source/data-source.model';

export abstract class PryBaseAccess {
  abstract hasRole(...args: any[]): Observable<boolean>;
  abstract canModifyPresentation(presentation: ManifestDescription): Observable<boolean>;
  abstract hasGroup(group: string): Observable<boolean>;
  abstract canModifyDataset(dataset: Dataset): Observable<boolean>;
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

  override canModifyPresentation(presentation: ManifestDescription): Observable<boolean> {
    return of(presentation?.owner);
  }

  override hasGroup(group: string): Observable<boolean> {
    return of(true);
  }

  override canModifyDataset(dataset: Dataset): Observable<boolean> {
    return of(dataset.owner ?? false);
  }
}
