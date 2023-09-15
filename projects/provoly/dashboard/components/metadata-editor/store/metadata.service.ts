import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigSelectors, IMetadata } from '@provoly/dashboard';
import { mergeMap, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  constructor(private httpClient: HttpClient, private store: Store<any>) {}

  getMetadataList(): Observable<any> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<any>(`${url}/metadata`)));
  }

  getMetadata(id: string): Observable<IMetadata> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<IMetadata>(`${url}/metadata/id/${id}`)));
  }

  postMetadata(metadata: IMetadata): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(`${url}/metadata`, metadata)));
  }
}
