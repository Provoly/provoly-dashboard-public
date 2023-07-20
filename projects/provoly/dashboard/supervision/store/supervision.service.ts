import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigSelectors } from '@provoly/dashboard';
import { mergeMap, Observable } from 'rxjs';
import { Infrastructure, InputFlow, IntegrationError } from '../store/supervision-api.model';

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {
  constructor(
    private httpClient: HttpClient,
    private store: Store<any>
  ) {}

  getInfrastructures(): Observable<Infrastructure[]> {
    return this.store
      .select(ConfigSelectors.monitorUrl)
      .pipe(mergeMap((url) => this.httpClient.get<Infrastructure[]>(encodeURI(`${url}/status`))));
  }

  scaleInfra(infra: string, replicas: number): Observable<string> {
    return this.store
      .select(ConfigSelectors.monitorUrl)
      .pipe(
        mergeMap((url) => this.httpClient.post<string>(encodeURI(`${url}/replicas/${infra}?scale=${replicas}`), {}))
      );
  }

  getInputFlows(): Observable<InputFlow[]> {
    return this.store
      .select(ConfigSelectors.monitorUrl)
      .pipe(
        mergeMap((url) => this.httpClient.get<InputFlow[]>(encodeURI(`${url}/supervision/nifi/monitoringInputFlow`)))
      );
  }

  getDateIso(): string {
    return new Date().toISOString();
  }

  getIntegrationErrors(): Observable<IntegrationError[]> {
    return this.store
      .select(ConfigSelectors.replayUrl)
      .pipe(mergeMap((url) => this.httpClient.get<IntegrationError[]>(encodeURI(`${url}/integrations/errors`))));
  }

  reloadErrors(classes: string[]): Observable<void> {
    return this.store
      .select(ConfigSelectors.replayUrl)
      .pipe(
        mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/integrations/errors/replay/class`), classes))
      );
  }

  acknowledgeErrors(classes: string[]): Observable<void> {
    return this.store
      .select(ConfigSelectors.replayUrl)
      .pipe(
        mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/integrations/errors/acknowledge`), classes))
      );
  }
}
