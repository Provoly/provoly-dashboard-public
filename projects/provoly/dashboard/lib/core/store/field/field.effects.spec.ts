import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { FieldEffects } from './field.effects';
import { FieldService } from './field.service';

describe('FieldEffects', () => {
  let actions$: Observable<any>;
  let effects: FieldEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FieldEffects,
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
