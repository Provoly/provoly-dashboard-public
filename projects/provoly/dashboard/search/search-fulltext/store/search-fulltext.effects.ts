import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DataSourceActions, DataSourceSelectors, DEFAULT_NAMED_QUERY_ID, SearchActions } from '@provoly/dashboard';
import { map, withLatestFrom } from 'rxjs';
import { searchFulltextActions } from './search-fulltext.actions';
import { SearchFulltextService } from './search-fulltext.service';

@Injectable()
export class SearchFulltextEffects {
  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchFulltextActions.search, searchFulltextActions.save),
      withLatestFrom(this.store.select(DataSourceSelectors.currentEdit)),
      map(([action, currentEdit]) => {
        const payload = this.searchFulltextService.buildPayload(action.search, action.classes);
        if (action.type === searchFulltextActions.save.type && DEFAULT_NAMED_QUERY_ID !== action?.id) {
          return DataSourceActions.namedQuery.post({
            id: action.id ?? currentEdit?.id,
            name: action.descriptionQuery.name,
            description: action.descriptionQuery?.description,
            visibility: action.descriptionQuery?.visibility,
            payload,
            color: currentEdit?.color,
            favorite: currentEdit?.favorite ?? false,
            isEdit: !!currentEdit
          });
        }
        return SearchActions.search({ payload });
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private searchFulltextService: SearchFulltextService
  ) {}
}
