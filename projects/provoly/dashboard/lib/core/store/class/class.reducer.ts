import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { DatasetCount } from '../../model/dataset.interface';
import { ClassActions } from './class.actions';
import { Class } from './class.interface';

export const classesFeatureKey = '@pry/model/classes';

export interface ClassState extends EntityState<Class> {
  // additional entities state properties
  loading: boolean;
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
  on(ClassActions.load, (state, action) => ({
    ...state,
    loading: true
  })),
  on(ClassActions.loadSuccess, (state, action) => ({
    ...adapter.setAll(action.classes, state),
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

export const { selectEntities, selectAll } = adapter.getSelectors();

export function classReducer(state: ClassState, action: Action) {
  return internalReducer(state, action);
}
