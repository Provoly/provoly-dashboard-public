import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { mergeMap, Observable } from 'rxjs';
import { Field } from './field.interface';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '../config/config.selectors';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>
  ) {}

  getFields(): Observable<Array<Field>> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Array<Field>>(encodeURI(`${url}/model/fields`))));
  }

  saveField(field: Field): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/model/fields`), field)));
  }

  updateField(field: Field): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.put<void>(encodeURI(`${url}/model/fields/${field.id}`), field)));
  }

  deleteField(id: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(encodeURI(`${url}/model/fields/${id}`))));
  }
}
