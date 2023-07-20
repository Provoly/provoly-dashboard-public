import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLinks from './links.reducer';

const feature = createFeatureSelector<fromLinks.LinkState>(fromLinks.linksFeatureKey);

const links = createSelector(feature, (state) => state?.links);

export const LinksSelectors = {
  feature,
  links
};
