import { ImagesSelectors, initialImageState } from '@provoly/dashboard';
import * as fromImage from './image.reducer';

describe('Image Selectors', () => {
  const initialState = Object.assign({}, initialImageState);

  it('should select the feature state', () => {
    const result = ImagesSelectors.feature({
      [fromImage.imageFeatureKey]: {}
    });

    expect(result).toEqual({});
  });

  it('should return a list of images with given filter', () => {
    const result = ImagesSelectors.imageWithFilter('test').projector({
      ...initialState,
      list: [{ image: 'test-image', type: ['test'] }]
    });
    expect(result).toEqual([{ image: 'test-image', type: ['test'] }]);
  });

  it('should return a last added file', () => {
    const result = ImagesSelectors.lastAdded.projector({
      ...initialState,
      lastAdded: 'my-id'
    });
    expect(result).toEqual('my-id');
  });
});
