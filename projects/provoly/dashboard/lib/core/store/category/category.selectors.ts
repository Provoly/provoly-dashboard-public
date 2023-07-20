import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCategory from './category.reducer';

const feature = createFeatureSelector<fromCategory.CategoryState>(fromCategory.categoriesFeatureKey);
const entities = createSelector(feature, fromCategory.selectEntities);
const categories = createSelector(feature, fromCategory.selectAll);

export const CategorySelectors = {
  feature,
  entities,
  categories
};
