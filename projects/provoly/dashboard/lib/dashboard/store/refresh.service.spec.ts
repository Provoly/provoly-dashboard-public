import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardSelectors } from './dashboard.selectors';
import { RefreshService } from './refresh.service';

describe('autoRefresh resultset', () => {
  let service: RefreshService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefreshService, provideMockStore({})]
    });

    service = TestBed.inject(RefreshService);
    store = TestBed.inject(Store);
  });

  it('should trigger', () => {
    const spyStore = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    jest.useFakeTimers();
    DashboardSelectors.refreshRates.setResult({ search: 2 });
    service.start();

    jest.advanceTimersToNextTimer(6);

    service.stop();

    jest.runAllTimers();

    expect(spyStore).toHaveBeenCalledTimes(3);
  });
});
