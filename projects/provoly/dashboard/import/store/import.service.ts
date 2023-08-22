import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '@provoly/dashboard';
import { mergeMap } from 'rxjs';
import { ImportResponse } from './import.actions';

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(private httpClient: HttpClient, private store: Store<any>) {}

  upload(file: File, datasetId: string, fileType: string) {
    const formData = new FormData();
    let mimeType = '';

    if (fileType === 'csv') {
      mimeType = 'text/csv';
    } else if (fileType === 'zip') {
      mimeType = 'application/shp';
    }
    formData.append('file', new Blob([file], { type: mimeType }), file.name);

    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) =>
        this.httpClient.post<ImportResponse>(`${url}/imports/dataset/id/${datasetId}`, formData, {
          headers: new HttpHeaders({ 'File-Content-Type': mimeType })
        })
      )
    );
  }
}
