import { createAction, props } from '@ngrx/store';
import { ResultSet } from '../../model/result-set.interface';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';

export const SearchActions = {
  search: createAction(
    '[Search] search',
    props<{ payload: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload; id?: string }>()
  ),
  getDatasourceItems: createAction('[Search] (bus) search named', props<{ id: string }>()),

  // result Search
  searchSuccess: createAction(
    '[Search Api] (bus) Search Success',
    props<{ resultSet: ResultSet; id?: string; params?: string }>()
  ),
  searchFailure: createAction('[Search Api] (bus) Search Failure', props<{ error: any; id?: string }>())
};
