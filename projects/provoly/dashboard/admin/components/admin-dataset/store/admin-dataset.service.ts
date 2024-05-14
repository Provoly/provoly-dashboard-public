import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigSelectors, Dataset, MetadataValue, ShareConflict } from '@provoly/dashboard';
import { HttpClient } from '@angular/common/http';
import { mergeMap, Observable } from 'rxjs';
import { AdminDatasetState } from './admin-dataset.reducer';

@Injectable({
  providedIn: 'root'
})
export class AdminDatasetService {
  constructor(
    private store: Store<AdminDatasetState>,
    private httpClient: HttpClient
  ) {}

  addDataset(dataset: Dataset): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/datasets`), dataset)));
  }

  updateDataset(dataset: Dataset): Observable<undefined | ShareConflict> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.put<undefined | ShareConflict>(encodeURI(`${url}/datasets`), dataset)));
  }

  deleteDataset(id: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(`${url}/datasets/id/${id}`)));
  }

  getDatasetById(id: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Dataset>(`${url}/datasets/id/${id}`)));
  }

  getDatasetMetadata(id: string): Observable<MetadataValue[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<MetadataValue[]>(`${url}/datasets/id/${id}/metadata`)));
  }

  addDatasetMetadata(datasetId: string, metadataId: string, value: any): Observable<void> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) =>
        this.httpClient.put<void>(encodeURI(`${url}/datasets/id/${datasetId}/metadata/id/${metadataId}`), {
          value: value
        })
      )
    );
  }

  deleteDatasetMetadata(datasetId: string, metadataId: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.delete<void>(encodeURI(`${url}/datasets/id/${datasetId}/metadata/id/${metadataId}`))
        )
      );
  }
}
