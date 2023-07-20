import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromImage from './image.reducer';

const feature = createFeatureSelector<fromImage.ImageState>(fromImage.imageFeatureKey);
const images = createSelector(feature, (state) => state);
const memoizeImageWithFilter = {} as any;
const imageWithFilter = (filter: string) => {
  if (!memoizeImageWithFilter[filter]) {
    memoizeImageWithFilter[filter] = createSelector(images, (images) =>
      images.list.filter((image) => image.type.includes(filter))
    );
  }
  return memoizeImageWithFilter[filter];
};
const lastAdded = createSelector(feature, (state) => state.lastAdded);

export const ImagesSelectors = {
  feature,
  images,
  imageWithFilter,
  lastAdded
};
