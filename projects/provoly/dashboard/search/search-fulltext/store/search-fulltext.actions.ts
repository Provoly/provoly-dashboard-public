import { createAction, props } from '@ngrx/store';
import { DescriptionQuery } from '@provoly/dashboard';

export const searchFulltextActions = {
  search: createAction('[Search Fulltext] search', props<{ search: string; classes: string[] }>()),
  save: createAction(
    '[Search Fulltext] save',
    props<{ search: string; classes: string[]; descriptionQuery: DescriptionQuery; id?: string }>()
  )
};
