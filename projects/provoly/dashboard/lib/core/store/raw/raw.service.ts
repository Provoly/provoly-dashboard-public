import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable } from 'rxjs';
import { ConfigSelectors } from '../config/config.selectors';

@Injectable({
  providedIn: 'root'
})
export class RawService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private domSanitizer: DomSanitizer
  ) {}

  get(itemId: string, attributeName: string): Observable<{ type: string; url: SafeUrl }> {
    return this.store
      .select(ConfigSelectors.dataUrl)
      .pipe(
        mergeMap((url) =>
          this.httpClient.get(encodeURI(`${url}/file/id/${itemId}@${attributeName}`), {
            observe: 'response',
            responseType: 'blob'
          })
        )
      )
      .pipe(
        map((response) => {
          const header = response.headers.get('Content-Type') as string;
          if (header.includes('video') || header.includes('image')) {
            return {
              type: header,
              url: this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(response.body as Blob))
            };
          }
          throw new Error('unknown doc type');
        })
      );
  }

  upload(file: any, fileName: string, mimeType: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', fileName);

    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) =>
        this.httpClient.post<string>(`${url}/file`, formData, {
          headers: new HttpHeaders({ 'File-Content-Type': mimeType })
        })
      )
    );
  }
}
