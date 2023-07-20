import { createAction, props } from '@ngrx/store';
import {
  Attribute,
  ConditionType,
  DescriptionQuery,
  MonoClassSearchPayload,
  NormalizedCondition,
  OperatorType,
  OrderValue,
  ValueDataType
} from '@provoly/dashboard';

export const SearchMonoClassActions = {
  save: createAction('[SearchMonoClass] save', props<{ descriptionQuery: DescriptionQuery; id?: string }>()),
  search: createAction('[SearchMonoClass] launch Mono Class search'),
  load: createAction('[SearchMonoClass] launch Mono Class search'),
  saveMonoClassSearch: createAction('[SearchMonoClass] launch Mono Class search'),

  selectMonoClassSearch: createAction('[Condition] select mono class search', props<{ classId: string }>()),
  addFirstNormalizedCondition: createAction(
    '[Condition] add first normalizedCondition ',
    props<{ condition: NormalizedCondition }>()
  ),
  addNormalizedConditionAttributeForConditionId: createAction(
    '[Condition] add normalizedCondition attribute ',
    props<{ conditionId: string; attribute: Attribute }>()
  ),
  addNormalizedConditionComposedForConditionId: createAction(
    '[Condition] add normalizedCondition composed ',
    props<{ conditionId: string }>()
  ),
  addNormalizedConditionForConditionId: createAction(
    '[Condition] add normalizedCondition for condition id',
    props<{ conditionId: string; condition: NormalizedCondition }>()
  ),
  updateNormalizedConditionOperatorForConditionId: createAction(
    '[Condition] update normalizedCondition operator for condition id',
    props<{ conditionId: string; operator: OperatorType }>()
  ),
  updateNormalizedConditionValueForConditionId: createAction(
    '[Condition] update normalizedCondition value for condition id',
    props<{ conditionId: string; value: ValueDataType; upperValue?: ValueDataType }>()
  ),
  updateNormalizedConditionTypeForConditionId: createAction(
    '[Condition] update normalizedCondition type for condition id',
    props<{ conditionId: string; conditionType: ConditionType }>()
  ),
  deleteNormalizedConditionById: createAction(
    '[Condition] delete normalizedCondition for condition id',
    props<{ conditionId: string }>()
  ),
  deleteNormalizedCondition: createAction(
    '[Condition] delete normalizedCondition',
    props<{ condition: NormalizedCondition }>()
  ),
  removeConditionFromComposed: createAction(
    '[Condition] remove normalizedCondition id from parent composed',
    props<{ parentId: string; childrenId: string }>()
  ),
  loadExistingConditions: createAction(
    '[SearchMonoClass] load existing conditions',
    props<{ payload: MonoClassSearchPayload }>()
  ),
  addIdCondition: createAction('[SearchMonoClass] add id condition', props<{ ids: string[] }>()),
  addIdMaster: createAction('[SearchMonoClass] add id master', props<{ id: string }>()),
  addEntities: createAction(
    '[SearchMonoClass] add entities',
    props<{ entities: { [key: string]: NormalizedCondition } }>()
  ),
  addIdClass: createAction('[SearchMonoClass] add id class', props<{ id: string }>()),
  resetSearch: createAction('[SearchMonoClass] reset search'),
  addOrder: createAction('[SearchMonoClass] add order', props<{ attribute?: string; asc?: OrderValue }>())
};
