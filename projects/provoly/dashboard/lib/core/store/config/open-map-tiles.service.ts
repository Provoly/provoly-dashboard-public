import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, mergeMap, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ConfigSelectors } from './config.selectors';

@Injectable({
  providedIn: 'root'
})
export class OpenMapTilesService {
  h3Regexp = new RegExp(/<h3>(.*?)<.h3>/gm);
  pRegexp = new RegExp(/<p class="identifier">(.*?)<.p>/gm);

  constructor(
    private httpClient: HttpClient,
    private store: Store
  ) {}

  getStyles(): Observable<{ identifier: string; label: string }[]> {
    return this.store.select(ConfigSelectors.mapUrl).pipe(
      filter((mapUrl) => !!mapUrl),
      mergeMap((url) => this.httpClient.get(encodeURI(`${url}`), { responseType: 'text' })),
      map((html) => {
        const h3matches = html.match(this.h3Regexp);
        const pMatches = html.match(this.pRegexp);
        return (
          h3matches
            ?.filter((match, idx) => match.length > 9 && !!pMatches && pMatches[idx])
            .map((match, idx) => ({
              label: match.replace('<h3>', '').replace('</h3>', ''),
              // @ts-ignore
              identifier: pMatches[idx].replace('<p class="identifier">identifier: ', '').replace('</p>', '')
            })) ?? ([] as { identifier: string; label: string }[])
        ).sort((a, b) => a.label.localeCompare(b.label));
      })
    );
  }
}
