import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CategoryActions } from './category.actions';
import { Category } from './category.interface';

export const categoriesFeatureKey = '@pry/model/categories';

export interface CategoryState extends EntityState<Category> {
  // additional entities state properties
}

export function sortByName(a: Category, b: Category): number {
  return a.name.localeCompare(b.name);
}

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  sortComparer: sortByName
});

export const initialCassState: CategoryState = adapter.getInitialState({
  // additional entity state properties
});

const internalReducer = createReducer(
  initialCassState,
  on(CategoryActions.loadSuccess, (state, action) => adapter.setAll(action.categories, state))
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();

export function categoryReducer(state: CategoryState, action: Action) {
  return internalReducer(state, action);
}
