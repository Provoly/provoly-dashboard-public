import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, mergeMap, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PrySnackbarService } from '../../components/snackbar/snackbar.service';
import { PryI18nService } from '../../i18n/i18n.service';
import { Widget } from '../../model/widget.interface';
import { DEFAULT_NAMED_QUERY_ID, EXPLORE_NAMED_QUERY_ID } from '../search/search.constants';
import { ConfigSelectors } from './config.selectors';

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
}
