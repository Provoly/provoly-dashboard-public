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
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>
  ) {}

  upload(file: File, datasetId: string) {
    const formData = new FormData();
    formData.append('file', new Blob([file], { type: 'text/csv' }), file.name);

    return this.store.select(ConfigSelectors.dataUrl).pipe(
      mergeMap((url) =>
        this.httpClient.post<ImportResponse>(`${url}/imports/csv/dataset/id/${datasetId}`, formData, {
          headers: new HttpHeaders({ 'File-Content-Type': 'text/csv' })
        })
      )
    );
  }
}
