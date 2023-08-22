import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPipeline from './import.reducer';

const feature = createFeatureSelector<fromPipeline.ImportState>(fromPipeline.importFeatureKey);

const numberOfLines = createSelector(feature, (state) => state?.numberOfLines);
const errors = createSelector(feature, (state) => state?.errors);
const upload = createSelector(feature, (state) => state.loading);

export const ImportSelectors = {
  upload,
  numberOfLines,
  errors
};
