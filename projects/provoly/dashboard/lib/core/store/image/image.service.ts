import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable } from 'rxjs';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { ConfigSelectors } from '../config/config.selectors';
import { Image } from './image.actions';

export const INTERNALLY_STORED_IMAGE_PREFIX = 'internal:';

export enum LibraryTypes {
  ILLUSTRATION = 'illustration',
  ICON = 'icon'
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>,
    private domSanitizer: DomSanitizer,
    private snackbar: PrySnackbarService,
    private translateService: PryI18nService
  ) {}

  getImages(): Observable<Image[]> {
    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) => this.httpClient.get<Image[]>(encodeURI(`${url}/file/icons`))),
      map((images) =>
        images.map((image) => ({
          image: `${INTERNALLY_STORED_IMAGE_PREFIX}${image.image}`,
          type: image.type
        }))
      )
    );
  }

  getImage(path: string, externalUrl = false): Observable<{ type: string; url: SafeUrl }> {
    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) => {
        return this.httpClient
          .get(encodeURI(externalUrl ? path : `${url}/file/icons/${path}`), {
            observe: 'response',
            responseType: 'blob'
          })
          .pipe(
            map((response) => {
              const header = response.headers.get('Content-Type') as string;
              if (header.includes('video') || header.includes('image')) {
                return {
                  type: header,
                  url: this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response.body as Blob))
                };
              }
              throw { type: 'unknown', error: 'unknown doc type' };
            })
          );
      })
    );
  }

  upload(file: any, mediaType: string, type: string): Observable<string> {
    const formData = new FormData();
    formData.append('type', type);
    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) => {
        formData.append(
          'file',
          new File([file], Date.now() + file.name, {
            type: mediaType,
            lastModified: Date.now()
          })
        );
        return this.httpClient.post<string>(`${url}/file/icons`, formData, {
          headers: new HttpHeaders({ 'File-Content-Type': mediaType })
        });
      })
    );
  }
}
