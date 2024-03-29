import { createAction, props } from '@ngrx/store';
import { ResultSet } from '../../model/result-set.interface';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';

export const SearchActions = {
  search: createAction(
    '[Search] search',
    props<{ payload: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload; id?: string }>()
  ),
  getDatasourceItems: createAction(
    '[Search] (bus) get datasource items',
    props<{ id: string; excludeGeo: boolean; from: string }>()
  ),

  // result Search
  searchSuccess: createAction(
    '[Search Api] (bus) Search Success',
    props<{ resultSet: ResultSet; id?: string; params?: string }>()
  ),
  searchFailure: createAction('[Search Api] (bus) Search Failure', props<{ error: any; id?: string }>()),

  setSearchLoading: createAction(
    '[Search Api] (bus) set Search loading datasource status',
    props<{ datasources: string[]; start: boolean }>()
  ),
  getPossibleFilterValues: createAction(
    '[Dashboard] (bus) get possible filter values',
    props<{
      filterId: string;
      attributes: { id: string; datasource: string }[];
      limit: number;
    }>()
  ),
  setPossibleFilterValues: createAction(
    '[Dashboard] (bus) set possible filter values',
    props<{ filterId: string; values: string[] }>()
  )
};
