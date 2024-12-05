import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FieldEffects } from './field.effects';
import { FieldService } from './field.service';
import { provideMockStore } from '@ngrx/store/testing';

describe('AdminFieldEffects', () => {
  let actions$: Observable<any>;
  let effects: FieldEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FieldEffects,
        provideMockStore({}),
        provideMockActions(() => actions$),
        {
          provide: FieldService,
          useValue: {
            getFields: () => jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(FieldEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
