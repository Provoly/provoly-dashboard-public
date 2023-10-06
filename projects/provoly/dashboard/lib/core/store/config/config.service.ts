import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, combineLatest, forkJoin, map, mergeMap, Observable, of, tap } from 'rxjs';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { Widget } from '../../model/widget.interface';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from '../search/search.constants';
import { ConfigSelectors } from './config.selectors';
import { BackendVersion, FrontendVersion, Versions } from './versions.interface';

export interface ParamContent {
  domain: string;
  oClass: string;
  content: string;
}

export const SYMBOL_DOMAIN = 'symbol';
export const TABLE_ATTR_DOMAIN = 'tableAttr';
export const TOOLTIPS_DOMAIN = 'tooltips';
export const FILTERS_DOMAIN = 'filters';
export const TILE_ATTR_DOMAIN = 'tileAttr';

@Injectable()
export class ConfigService {
  static warn = true;

  constructor(
    private httpClient: HttpClient,
    private store: Store<any>,
    private snackBar: PrySnackbarService,
    private translateService: PryI18nService
  ) {}

  /**
   * Returns the list of icons rules for each class
   */
  getAllClassParams(): Observable<ParamContent[]> {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.get<ParamContent[]>(encodeURI(`${url}/customclass/all/param`))));
  }

  /**
   * Save the definitions from specified domain
   * @param definitions
   * @param domain
   */
  saveDefinitions(definitions: any, domain: string): Observable<void[]> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) => {
        // Launching a request for each indicated class, in parallel
        const requests = Object.keys(definitions)
          .filter((classId) => classId !== 'default')
          .map((classId) =>
            this.httpClient.put<void>(
              encodeURI(`${url}/customclass/id/${classId}/param/${domain}`),
              definitions[classId]
            )
          );
        return forkJoin(requests);
      })
    );
  }

  /**
   * Save a widget configuration
   * @param widget
   */
  saveWidget(widget: Widget) {
    const params = {
      ...widget,
      datasource: widget.datasource.filter((ds) => ![DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID].includes(ds))
    };
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.post<void>(encodeURI(`${url}/widget/catalog`), params)));
  }

  /**
   * Delete a widget configuration
   * @param id
   */
  deleteRestitution(id: string) {
    return this.store
      .select(ConfigSelectors.refUrl)
      .pipe(mergeMap((url) => this.httpClient.delete<void>(encodeURI(`${url}/widget/catalog/id/${id}`))));
  }

  /**
   * Get a list of all widgets from catalog
   */
  getAllWidgets(): Observable<Widget[]> {
    return this.store.select(ConfigSelectors.refUrl).pipe(
      mergeMap((url) => this.httpClient.get<Widget[]>(encodeURI(`${url}/widget/catalog`))),
      catchError((error) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred
          if (ConfigService.warn) {
            console.error('A frontend error occurred:', error.error.message);
          }
          this.snackBar.open({
            type: 'error',
            message: this.translateService.instant('@pry.manifest.get.errorFront', { msg: error.error.message })
          });
        } else {
          // The backend returned an unsuccessful response code.
          if (ConfigService.warn) {
            console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
          }
          if (error.code !== 204) {
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

  handleBackendVersionError(obs: Observable<BackendVersion>): Observable<BackendVersion> {
    return obs.pipe(catchError(() => of({})));
  }

  getAllVersions(): Observable<Versions> {
    return combineLatest([
      this.store.select(ConfigSelectors.refUrl).pipe(tap((v) => console.log(v))),
      this.store.select(ConfigSelectors.dataUrl).pipe(tap((v) => console.log(v))),
      this.store.select(ConfigSelectors.replayUrl).pipe(tap((v) => console.log(v))),
      this.store.select(ConfigSelectors.execUrl).pipe(tap((v) => console.log(v))),
      this.store.select(ConfigSelectors.transfoUrl).pipe(tap((v) => console.log(v))),
      this.store.select(ConfigSelectors.monitorUrl).pipe(tap((v) => console.log(v)))
    ]).pipe(
      mergeMap(([ref, data, replay, exec, transfo, monitor]) => {
        const allVersions: Observable<BackendVersion | FrontendVersion>[] = [
          this.handleBackendVersionError(this.httpClient.get<BackendVersion>(encodeURI(`${ref}/about/version`))),
          this.handleBackendVersionError(this.httpClient.get<BackendVersion>(encodeURI(`${data}/about/version`))),
          this.handleBackendVersionError(this.httpClient.get<BackendVersion>(encodeURI(`${replay}/about/version`))),
          this.handleBackendVersionError(this.httpClient.get<BackendVersion>(encodeURI(`${exec}/about/version`))),
          this.handleBackendVersionError(this.httpClient.get<BackendVersion>(encodeURI(`${transfo}/about/version`))),
          this.handleBackendVersionError(this.httpClient.get<BackendVersion>(encodeURI(`${monitor}/about/version`))),
          this.httpClient.get<string>(encodeURI(`/assets/pry.version`)).pipe(
            map((version) => (version ? { libVersion: version } : {})),
            catchError(() => of({}))
          )
        ];
        return combineLatest(allVersions).pipe(
          map(([refVersion, dataVersion, replayVersion, execVersion, tranfoVersion, monitorVersion, frontend]) => {
            const versions: Versions = {
              ref: refVersion,
              data: dataVersion,
              replay: replayVersion,
              exec: execVersion,
              transfo: tranfoVersion,
              monitor: monitorVersion,
              front: frontend
            };
            return versions;
          })
        );
      })
    );
  }
}
