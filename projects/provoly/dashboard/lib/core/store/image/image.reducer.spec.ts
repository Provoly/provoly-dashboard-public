import { ImageActions, imageReducer, initialImageState } from '@provoly/dashboard';

describe('Image Reducer', () => {
  const initialState = Object.assign({}, initialImageState);

  it('should set loading to true during loading', () => {
    expect(
      imageReducer(
        {
          ...initialState,
          loading: false
        },
        ImageActions.load()
      )
    ).toEqual({
      ...initialState,
      loading: true
    });
  });
  it('should set image list when loading is successful', () => {
    expect(
      imageReducer(
        {
          ...initialState,
          loading: true
        },
        ImageActions.loadSuccess({ images: [{ image: 'test', type: ['test'] }] })
      )
    ).toEqual({
      ...initialState,
      loading: false,
      list: [{ image: 'test', type: ['test'] }]
    });
  });
  it('should set last added image', () => {
    expect(
      imageReducer(
        {
          ...initialState,
          lastAdded: 'my-id'
        },
        ImageActions.added({ name: 'my-new-id' })
      )
    ).toEqual({
      ...initialState,
      lastAdded: 'my-new-id'
    });
  });
  it('should clear last added image', () => {
    expect(
      imageReducer(
        {
          ...initialState,
          lastAdded: 'my-id'
        },
        ImageActions.clearAdded()
      )
    ).toEqual({
      ...initialState,
      lastAdded: undefined
    });
  });
});
