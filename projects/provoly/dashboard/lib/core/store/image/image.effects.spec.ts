import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Image, ImageActions, ImageService } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { ImageEffects } from './image.effects';

let image: Image = {
  image: 'image',
  type: ['test']
};

describe('ImageEffects', () => {
  let actions$: Observable<any>;
  let effects: ImageEffects;
  let service: ImageService;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ImageEffects,
        provideMockStore({}),
        provideMockActions(() => actions$),
        {
          provide: ImageService,
          useValue: {
            getImages: () => of([image]),
            upload: () => of('test')
          }
        }
      ]
    });

    effects = TestBed.inject(ImageEffects);
    service = TestBed.inject<ImageService>(ImageService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('addImages$', () => {
    it('should reload and sotre last added image', () => {
      actions$ = hot('--a-', {
        a: ImageActions.add({ file: {}, mediaType: 'image/png', imageType: 'type' })
      });

      const expected$ = hot('--(ab)', {
        a: ImageActions.load(),
        b: ImageActions.added({ name: 'test' })
      });
      expect(effects.addImages$).toBeObservable(expected$);
    });
  });
});
