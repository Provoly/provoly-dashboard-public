import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPipeline from './import.reducer';

const feature = createFeatureSelector<fromPipeline.ImportState>(fromPipeline.importFeatureKey);

const numberOfLines = createSelector(feature, (state) => state?.numberOfLines);
const errors = createSelector(feature, (state) => state?.errors);

export const ImportSelectors = {
  numberOfLines,
  errors
};
