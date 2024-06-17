import { Overlay } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PrySnackbarService } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { NotificationEffects } from './notification.effects';
import { initialNotificationState } from './notification.reducer';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

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
        { provide: Overlay, useValue: MockOverlay }
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
