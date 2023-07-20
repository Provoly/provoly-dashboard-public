import { createAction, props } from '@ngrx/store';
import { MetadataRules, MetadataRulesCreate } from '@provoly/dashboard';

export enum MetadataRulesActionTypes {
  LOAD = '[MetadataRules] load MetadataRules',
  LOADED = '[MetadataRules] loaded MetadataRules',
  POST = '[MetadataRules] post MetadataRules',
  DELETE = '[MetadataRules] delete MetadataRules',
  OPEN_DETAIL = '[MetadataRules] open MetadataRules details',
  OPEN_NEW_METADATA_RULES = '[MetadataRules] open new MetadataRules',
  UNSELECT_METADATA = '[MetadataRules] unselect MetadataRules',
  FAILURE = '[MetadataRules] failure effect metadataRules'
}

export const AdminMetadataRulesActions = {
  load: createAction(MetadataRulesActionTypes.LOAD),
  loaded: createAction(MetadataRulesActionTypes.LOADED, props<{ list: MetadataRules[] }>()),
  failure: createAction(MetadataRulesActionTypes.FAILURE, props<{ error: any }>()),

  post: createAction(MetadataRulesActionTypes.POST, props<{ metadata: MetadataRulesCreate }>()),
  delete: createAction(MetadataRulesActionTypes.DELETE, props<{ name: string; route: string; addRoute: string }>()),

  unselectMetadata: createAction(MetadataRulesActionTypes.UNSELECT_METADATA),

  selectMetadata: createAction(MetadataRulesActionTypes.OPEN_DETAIL, props<{ metadataRules: MetadataRules }>()),

  openNewMetadataRules: createAction(MetadataRulesActionTypes.OPEN_NEW_METADATA_RULES, props<{ route: string }>())
};
