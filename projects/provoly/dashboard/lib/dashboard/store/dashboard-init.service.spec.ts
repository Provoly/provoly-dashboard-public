import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfigActions } from '../../core/store/config/config.actions';
import { BASE_CONFIG, DashboardInitService } from './dashboard-init.service';

describe('DashboardService', () => {
  let service: DashboardInitService;
  let store: Store;
  let router: Router;
  let dispatchSpy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DashboardInitService,
        {
          provide: BASE_CONFIG,
          useValue: {
            path: '/path',
            pryUrl: 'http://pryUrl',
            mapUrl: 'http://mapUrl'
          }
        },
        {
          provide: Store,
          useValue: {
            dispatch: () => {}
          }
        },
        {
          provide: Router,
          useValue: {
            config: []
          }
        }
      ]
    });
    service = TestBed.inject(DashboardInitService);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    dispatchSpy = jest.spyOn(store, 'dispatch').mockReturnValue();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch conf', () => {
    const url = 'http://locahost:8080';

    service.init();
    expect(dispatchSpy).toHaveBeenCalledWith(
      ConfigActions.defineUrls({ pryUrl: 'http://pryUrl', mapUrl: 'http://mapUrl' })
    );
  });
});
