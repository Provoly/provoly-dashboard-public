import { createReducer, on } from '@ngrx/store';
import { MultiClassCondition } from '@provoly/dashboard';
import { SearchMultiClassActions } from './search-multi-class.actions';

export const searchMultiClassFeatureKey = '@pry/search/multi-class';

export interface SearchMultiClassState {
  multiType: 'AND' | 'OR';
  conditions: MultiClassCondition[];
}

export const initialSearchState: SearchMultiClassState = {
  multiType: 'AND',
  conditions: []
};

export const searchMultiClassReducer = createReducer(
  initialSearchState,
  on(SearchMultiClassActions.updateMultiType, (state, action) => ({
    ...state,
    multiType: action.multiType
  })),
  on(SearchMultiClassActions.addMultiClassCondition, (state, action) => ({
    ...state,
    conditions: [...state.conditions, action.condition]
  })),
  on(SearchMultiClassActions.removeCondition, (state, action) => ({
    ...state,
    conditions: [...state.conditions.filter((c) => c.id !== action.conditionId)]
  })),
  on(SearchMultiClassActions.updateConditionField, (state, action) => ({
    ...state,
    conditions: [
      ...state.conditions.map((c) =>
        c.id === action.conditionId
          ? ({
              ...c,
              field: action.field
            } as MultiClassCondition)
          : c
      )
    ]
  })),
  on(SearchMultiClassActions.updateConditionPattern, (state, action) => ({
    ...state,
    conditions: [
      ...state.conditions.map((c) =>
        c.id === action.conditionId
          ? ({
              ...c,
              pattern: action.pattern,
              isDate: action.isDate,
              operator: action.isDate ? 'GREATER_THAN' : 'EQUALS',
              value: null
            } as MultiClassCondition)
          : c
      )
    ]
  })),
  on(SearchMultiClassActions.updateCondition, (state, action) => ({
    ...state,
    conditions: [
      ...state.conditions.map((c) =>
        c.id === action.conditionId
          ? {
              ...c,
              [action.key]: action.value,
              upperValue: action.upperValue
            }
          : c
      )
    ]
  })),
  on(SearchMultiClassActions.updateConditions, (state, action) => ({
    ...state,
    conditions: action.conditions
  })),
  on(SearchMultiClassActions.resetSearch, (state) => ({
    ...state,
    multiType: 'AND',
    conditions: []
  }))
);
