import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable, of, switchMap } from 'rxjs';
import { PryI18nService } from '../../i18n/i18n.service';
import { MetadataValue } from '../../model/admin-api.model';
import { DatasetPreview } from '../../model/dataset.interface';
import { ConfigState } from '../config/config.reducer';
import { ConfigSelectors } from '../config/config.selectors';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from '../search/search.constants';
import { Dataset, DatasetVersion, NamedQuery } from './data-source.model';
import { DataSourceState } from './data-source.reducer';
import { ShareConflict } from '../../components/share/share.model';

export interface ResponseRequest {
  data: {
    success: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DataSourceService {
  constructor(
    private store: Store<ConfigState | DataSourceState>,
    private httpClient: HttpClient,
    private translateService: PryI18nService
  ) {}

  get(): Observable<NamedQuery[]> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) => this.httpClient.get<NamedQuery[]>(encodeURI(`${url}/users/me/namedquery`))),
      map((nqs) => [
        ...nqs,
        {
          id: DEFAULT_NAMED_QUERY_ID,
          name: this.translateService.instant('@pry.widget.namedQuery.defaultRs'),
          color: '#84eac5',
          lastExecutionDate: 100,
          request: null
        } as unknown as NamedQuery,
        {
          id: EXPLORE_NAMED_QUERY_ID,
          name: this.translateService.instant('@pry.search.namedQuery.explore'),
          color: '#6a2974',
          lastExecutionDate: 50,
          request: null
        } as unknown as NamedQuery
      ]),
      map((nqs) => nqs.map((nq) => ({ ...nq, sourceType: 'namedQuery' })))
    );
  }

  post(namedQuery?: NamedQuery): Observable<ResponseRequest> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          namedQuery?.id !== DEFAULT_NAMED_QUERY_ID
            ? this.httpClient.post<ResponseRequest>(encodeURI(`${url}/users/me/namedquery`), namedQuery)
            : of({ data: { success: true } })
        )
      );
  }

  delete(id: string): Observable<ResponseRequest> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<ResponseRequest>(encodeURI(`${url}/users/me/namedquery/${id}`))));
  }

  addFavorite(id: string): Observable<ResponseRequest> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.post<ResponseRequest>(encodeURI(`${url}/users/me/namedquery/${id}/favorite`), null)
        )
      );
  }

  deleteFavorite(id: string): Observable<ResponseRequest> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.delete<ResponseRequest>(encodeURI(`${url}/users/me/namedquery/${id}/favorite`))
        )
      );
  }

  getDatasets(): Observable<Dataset[]> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) => this.httpClient.get<Dataset[]>(encodeURI(`${url}/datasets`))),
      map((dsds) => dsds.map((dsd) => ({ ...dsd, sourceType: 'dataset' })))
    );
  }

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

  getDatasetVersions() {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(switchMap((url) => this.httpClient.get<DatasetVersion[]>(encodeURI(`${url}/dataset-versions`))));
  }

  getDatasetVersionsById(id: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        switchMap((url) =>
          this.httpClient.get<DatasetVersion[]>(encodeURI(`${url}/datasets/id/${id}/dataset-versions`))
        )
      );
  }

  getPreviews(id: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) => this.httpClient.get<DatasetPreview[]>(encodeURI(`${url}/dataset-versions/id/${id}/previews`)))
      );
  }

  deactivateDatasetVersion(versionId: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        switchMap((url) =>
          this.httpClient.post<DatasetVersion>(encodeURI(`${url}/dataset-versions/id/${versionId}/deactivate`), null)
        )
      );
  }

  activateDatasetVersion(versionId: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        switchMap((url) =>
          this.httpClient.post<DatasetVersion>(encodeURI(`${url}/dataset-versions/id/${versionId}/activate`), null)
        )
      );
  }

  getLastActiveDatasetVersion(datasetId: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        switchMap((url) =>
          this.httpClient.get<DatasetVersion>(encodeURI(`${url}/datasets/${datasetId}/dataset-versions/latest`))
        )
      );
  }

  updateDatasetVersionInfo(version: Partial<DatasetVersion>) {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      switchMap((url) =>
        this.httpClient.put<DatasetVersion>(encodeURI(`${url}/dataset-versions/id/${version.id}`), {
          additionalInformation: version.additionalInformation,
          producer: version.producer,
          productionDate: version.productionDate
        })
      )
    );
  }

  deleteDatasetVersion(version: DatasetVersion) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(switchMap((url) => this.httpClient.delete<void>(encodeURI(`${url}/dataset-versions/id/${version.id}`))));
  }
}
