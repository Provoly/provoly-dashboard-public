import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ContextMenuEffects } from './context-menu.effects';

describe('ContextMenuEffects', () => {
  let actions$: Observable<any>;
  let effects: ContextMenuEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContextMenuEffects, provideMockActions(() => actions$)]
    });

    effects = TestBed.inject(ContextMenuEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
