import { Injectable } from '@angular/core';
import { FullTextSearchPayload, NamedQueryTypes } from '@provoly/dashboard';

@Injectable({ providedIn: 'root' })
export class SearchFulltextService {
  buildPayload(value: string, oClasses: string[]): FullTextSearchPayload {
    return {
      type: NamedQueryTypes.MULTI_CLASS,
      multiType: 'AND',
      oClasses,
      fullSearch: {
        value
      }
    };
  }
}
