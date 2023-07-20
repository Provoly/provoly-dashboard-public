import { createAction, props } from '@ngrx/store';
import { DescriptionQuery, MultiClassCondition, MultiClassSearchPayload } from '@provoly/dashboard';

export const SearchMultiClassActions = {
  updateMultiType: createAction('[Search Multi class] update conditonnal type', props<{ multiType: 'AND' | 'OR' }>()),
  addNewEmptyCondition: createAction('[SearchMultiClass] add empty condition'),
  addMultiClassCondition: createAction(
    '[SearchMultiClass] add multi class condition',
    props<{ condition: MultiClassCondition }>()
  ),
  updateConditionField: createAction(
    '[SearchMultiClass] update condition field',
    props<{ conditionId: string; field: string }>()
  ),
  updateCondition: createAction(
    '[SearchMultiClass] update condition',
    props<{ conditionId: string; key: keyof MultiClassCondition; value: any; upperValue?: any }>()
  ),
  updateConditionPattern: createAction(
    '[SearchMultiClass] update condition pattern',
    props<{ conditionId: string; pattern: string; isDate: boolean }>()
  ),
  removeCondition: createAction('[SearchMultiClass] remove condition', props<{ conditionId: string }>()),
  resetSearch: createAction('[SearchMultiClass] reset search'),

  loadExistingConditions: createAction(
    '[SearchMultiClass] load existing conditions',
    props<{ payload: MultiClassSearchPayload }>()
  ),
  updateConditions: createAction(
    '[SearchMultiClass] update conditions',
    props<{ conditions: MultiClassCondition[] }>()
  ),

  search: createAction('[SearchMultiClass] launch search'),
  save: createAction('[SearchMultiClass] launch save', props<{ descriptionQuery: DescriptionQuery; id?: string }>())
};
