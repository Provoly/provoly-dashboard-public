import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '@provoly/dashboard';
import { mergeMap, Observable } from 'rxjs';
import { PryTransfo } from '../components/pipeline-editor/pipeline.interface';
import { PipelineResponse } from './pipeline.actions';

@Injectable({
  providedIn: 'root'
})
export class PipelineService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>
  ) {}

  check(graph: any): Observable<PipelineResponse> {
    return this.store
      .select(ConfigSelectors.transfoUrl)
      .pipe(mergeMap((url) => this.httpClient.put<PipelineResponse>(`${url}/transfos`, graph)));
  }

  list(): Observable<PryTransfo[]> {
    return this.store
      .select(ConfigSelectors.transfoUrl)
      .pipe(mergeMap((url) => this.httpClient.get<PryTransfo[]>(encodeURI(`${url}/transfos`))));
  }

  get(id: string): Observable<PryTransfo> {
    return this.store
      .select(ConfigSelectors.transfoUrl)
      .pipe(mergeMap((url) => this.httpClient.get<PryTransfo>(encodeURI(`${url}/transfos/id/${id}`))));
  }

  activate(id: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.transfoUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/transfos/id/${id}/activation`), null)));
  }

  deactivate(id: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.transfoUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(encodeURI(`${url}/transfos/id/${id}/activation`))));
  }

  execute(id: string): Observable<void> {
    return this.store
      .select(ConfigSelectors.execUrl)
      .pipe(mergeMap((url) => this.httpClient.put<void>(encodeURI(`${url}/job/instances/id/${id}/start`), null)));
  }
}
