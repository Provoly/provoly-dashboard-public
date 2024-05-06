import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { mergeMap, Observable, of } from 'rxjs';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import { PrySnackbarService } from '../../core/components/snackbar/snackbar.service';
import { PryI18nService } from '../../core/i18n/i18n.service';
import { GlobalManifest, ManifestDescription } from '../../core/model/manifest.interface';
import { ConfigSelectors } from '../../core/store/config/config.selectors';
import { ManifestUtils } from './manifest-utils.class';
import { DashboardSelectors } from './dashboard.selectors';
import { ShareConflict } from '../../core/components/share/share.model';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>,
    private snackBar: PrySnackbarService,
    private translateService: PryI18nService
  ) {}

  list(): Observable<ManifestDescription[]> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) => this.httpClient.get<ManifestDescription[]>(encodeURI(`${url}/users/me/dashboards`))),
      catchError((error) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred
          console.error('A frontend error occurred:', error.error.message);
          this.snackBar.open({
            type: 'error',
            message: this.translateService.instant('@pry.manifest.get.errorFront', { msg: error.error.message })
          });
        } else {
          // The backend returned an unsuccessful response code.
          if (error.code !== 200) {
            console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
          }
          if (error.code >= 400) {
            this.snackBar.open({
              type: 'error',
              message: this.translateService.instant('@pry.manifest.get.errorBack', {
                code: error.status
              })
            });
          }
        }
        return of([]);
      })
    );
  }

  get(id: string): Observable<GlobalManifest> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.get<GlobalManifest>(encodeURI(`${url}/users/me/dashboards/id/${id}/manifest`))
        )
      );
  }

  save(
    name: string,
    manifest: GlobalManifest,
    id: string,
    description?: string,
    image?: string,
    metadata?: { metadataDefId: string; value: string }[],
    accessRightsByGroup?: { [key: string]: string[] },
    additionalInformation?: string
  ): Observable<ShareConflict> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) => {
        return this.httpClient.post<ShareConflict>(encodeURI(`${url}/users/me/dashboards`), {
          id,
          name,
          description,
          manifest,
          image,
          cover: true,
          metadata,
          datasource: ManifestUtils.getDatasourcesUsedByManifest(manifest).map((ds) => ds.datasetId),
          accessRightsByGroup,
          additionalInformation
        });
      })
    );
  }

  delete(id: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(encodeURI(`${url}/users/me/dashboards/id/${id}`))));
  }

  default(id: string): Observable<boolean> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      withLatestFrom(this.store.select(DashboardSelectors.manifestsList)),
      mergeMap(([url, manifests]) => {
        const actual = manifests.find((manifest: { id: string }) => manifest.id === id);
        if (!!actual) {
          return this.httpClient
            .put<ArrayBuffer>(encodeURI(`${url}/users/me/dashboards/id/${id}/default`), {})
            .pipe(map(() => true));
        } else {
          return this.httpClient
            .delete<ArrayBuffer>(encodeURI(`${url}/users/me/dashboards/default`), {})
            .pipe(map(() => false));
        }
      })
    );
  }

  addMetadata(presentationId: string, metadataId: string, value: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.put<void>(
            encodeURI(`${url}/users/me/dashboards/id/${presentationId}/metadata/id/${metadataId}`),
            { value }
          )
        )
      );
  }

  deleteMetadata(presentationId: string, metadataId: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.delete<void>(
            encodeURI(`${url}/users/me/dashboards/id/${presentationId}/metadata/id/${metadataId}`)
          )
        )
      );
  }
}
