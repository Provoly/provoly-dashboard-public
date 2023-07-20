import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { DatasetCount } from '../../model/dataset.interface';
import { ClassActions } from './class.actions';
import { BusinessData, Class } from './class.interface';

export const classesFeatureKey = '@pry/model/classes';

export interface ClassState extends EntityState<Class> {
  // additional entities state properties
  loading: boolean;
  classDatas: BusinessData[];
  datasetCounts: DatasetCount[];
}

export function sortByName(a: Class, b: Class): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<Class> = createEntityAdapter<Class>({
  sortComparer: sortByName
});

export const initialClassState: ClassState = adapter.getInitialState({
  // additional entity state properties
  loading: false,
  classDatas: [],
  datasetCounts: []
});

const internalReducer = createReducer(
  initialClassState,
  on(ClassActions.loadSuccess, (state, action) => adapter.setAll(action.classes, state)),
  on(ClassActions.loadBusinessData, (state, action) => ({
    ...state,
    loading: true
  })),
  on(ClassActions.loadBusinessDataSuccess, (state, action) => ({
    ...state,
    loading: false,
    classDatas: action.datas
  })),
  on(ClassActions.loadBusinessDataFailure, (state, action) => ({
    ...state,
    loading: false
  })),
  on(ClassActions.loadDatasetCount, (state, action) => ({
    ...state,
    loading: true
  })),
  on(ClassActions.loadDatasetCountSuccess, (state, action) => ({
    ...state,
    loading: false,
    datasetCounts: action.datasetCounts
  })),
  on(ClassActions.loadDatasetCountFailure, (state, action) => ({
    ...state,
    loading: false
  }))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export function classReducer(state: ClassState, action: Action) {
  return internalReducer(state, action);
}
