import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';
import { PrySnackbarService } from '../../lib/core/components/snackbar/snackbar.service';
import { NotificationEffects } from './notification.effects';
import { initialNotificationState } from './notification.reducer';

describe('NotificationEffects', () => {
  let actions$: Observable<any>;
  let effects: NotificationEffects;
  let snackbarService: PrySnackbarService;
  const initialState = initialNotificationState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        NotificationEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: Overlay,
          useValue: {}
        }
      ]
    });

    effects = TestBed.inject(NotificationEffects);
    snackbarService = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
