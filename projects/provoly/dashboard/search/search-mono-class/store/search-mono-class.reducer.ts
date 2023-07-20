import { createReducer, on } from '@ngrx/store';
import { MonoClassConditions, ResultOrder } from '@provoly/dashboard';
import { SearchMonoClassActions } from './search-mono-class.actions';

export const searchMonoClassFeatureKey = '@pry/search/mono-class';

export interface SearchMonoClassState {
  loading: boolean;
  monoClassConditions: MonoClassConditions;
  monoClassId?: string;
  order?: ResultOrder;
}

export const initialSearchMonoClassState: SearchMonoClassState = {
  loading: false,
  monoClassConditions: {
    masterId: null,
    ids: [],
    entities: {}
  },
  order: undefined
};

export const searchMonoClassReducer = createReducer(
  initialSearchMonoClassState,
  on(SearchMonoClassActions.selectMonoClassSearch, (state, action) => ({
    ...state,
    monoClassId: action.classId
  })),
  on(SearchMonoClassActions.addFirstNormalizedCondition, (state, action) => ({
    ...state,
    monoClassConditions: {
      masterId: action.condition.id,
      ids: [action.condition.id],
      entities: {
        [action.condition.id]: action.condition
      }
    }
  })),
  on(SearchMonoClassActions.addNormalizedConditionForConditionId, (state, action) => {
    const composedIds = [
      ...(state.monoClassConditions.entities[action.conditionId]?.composed ?? []),
      action.condition.id
    ];
    return {
      ...state,
      monoClassConditions: {
        ...state.monoClassConditions,
        ids: [...state.monoClassConditions.ids, action.condition.id],
        entities: {
          ...state.monoClassConditions.entities,
          [action.conditionId]: {
            ...state.monoClassConditions.entities[action.conditionId],
            composed: composedIds
          },
          [action.condition.id]: action.condition
        }
      }
    };
  }),
  on(SearchMonoClassActions.updateNormalizedConditionOperatorForConditionId, (state, action) => ({
    ...state,
    monoClassConditions: {
      ...state.monoClassConditions,
      entities: {
        ...state.monoClassConditions.entities,
        [action.conditionId]: {
          ...state.monoClassConditions.entities[action.conditionId],
          operator: action.operator
        }
      }
    }
  })),
  on(SearchMonoClassActions.updateNormalizedConditionValueForConditionId, (state, action) => ({
    ...state,
    monoClassConditions: {
      ...state.monoClassConditions,
      entities: {
        ...state.monoClassConditions.entities,
        [action.conditionId]: {
          ...state.monoClassConditions.entities[action.conditionId],
          value: action.value,
          upperValue: action.upperValue
        }
      }
    }
  })),
  on(SearchMonoClassActions.updateNormalizedConditionTypeForConditionId, (state, action) => ({
    ...state,
    monoClassConditions: {
      ...state.monoClassConditions,
      entities: {
        ...state.monoClassConditions.entities,
        [action.conditionId]: {
          ...state.monoClassConditions.entities[action.conditionId],
          type: action.conditionType
        }
      }
    }
  })),
  on(SearchMonoClassActions.deleteNormalizedCondition, (state, action) => {
    const ids = [...state.monoClassConditions.ids.filter((id) => id !== action.condition.id)];
    const { [action.condition.id]: value, ...entities } = { ...state.monoClassConditions.entities };
    return {
      ...state,
      monoClassConditions: {
        ...state.monoClassConditions,
        ids,
        entities
      }
    };
  }),
  on(SearchMonoClassActions.removeConditionFromComposed, (state, action) => ({
    ...state,
    monoClassConditions: {
      ...state.monoClassConditions,
      entities: {
        ...state.monoClassConditions.entities,
        [action.parentId]: {
          ...state.monoClassConditions.entities[action.parentId],
          composed: [
            ...(state.monoClassConditions.entities[action.parentId]?.composed?.filter(
              (el) => el !== action.childrenId
            ) ?? [])
          ]
        }
      }
    }
  })),
  on(SearchMonoClassActions.addIdCondition, (state, action) => ({
    ...state,
    monoClassConditions: { ...state.monoClassConditions, ids: [...action.ids] }
  })),
  on(SearchMonoClassActions.addIdMaster, (state, action) => ({
    ...state,
    monoClassConditions: { ...state.monoClassConditions, masterId: action.id }
  })),
  on(SearchMonoClassActions.addEntities, (state, action) => ({
    ...state,
    monoClassConditions: {
      ...state.monoClassConditions,
      entities: { ...action.entities }
    }
  })),
  on(SearchMonoClassActions.addIdClass, (state, action) => ({
    ...state,
    monoClassId: action.id
  })),
  on(SearchMonoClassActions.resetSearch, (state) => ({
    ...state,
    monoClassId: undefined,
    monoClassConditions: {
      masterId: null,
      ids: [],
      entities: {}
    }
  })),
  on(SearchMonoClassActions.addOrder, (state, action) => ({
    ...state,
    order: action.asc
      ? {
          attribute: action.attribute ?? state.order?.attribute ?? '',
          asc: action.asc
        }
      : undefined
  }))
);
