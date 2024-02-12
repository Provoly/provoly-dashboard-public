import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { SearchActions, WidgetFactoryService, WidgetManifest } from '@provoly/dashboard';
import { DashboardSelectors } from './dashboard.selectors';
import { RefreshService } from './refresh.service';
import { WidgetImageComponent } from '@provoly/dashboard/widgets/widget-image';

describe('autoRefresh resultset', () => {
  let service: RefreshService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RefreshService,
        provideMockStore({}),
        {
          provide: WidgetFactoryService,
          useValue: {
            resolveComponent: jest.fn(() => WidgetImageComponent),
            getObjectsToAutoLoad: () => ({
              datasources: [
                { datasetId: 'no-exclude', excludeGeo: false },
                { datasetId: 'exclude', excludeGeo: true }
              ],
              aggregations: []
            })
          }
        }
      ]
    });

    service = TestBed.inject(RefreshService);
    store = TestBed.inject(Store);
  });

  it('should trigger', () => {
    const spyStore = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    jest.useFakeTimers();
    DashboardSelectors.refreshRates.setResult({ 'no-exclude': 2, noTrigger: 2, exclude: 3 });
    DashboardSelectors.globalManifest.setResult({
      windows: [
        {
          widgets: [
            { type: 'map', datasource: 'no-exclude' },
            { type: 'table', datasource: 'exclude' }
          ] as WidgetManifest[]
        }
      ]
    });
    service.start();

    jest.advanceTimersToNextTimer(6);

    service.stop();

    jest.runAllTimers();

    expect(spyStore).toHaveBeenCalledTimes(5);
    expect(spyStore).toHaveBeenCalledWith(
      SearchActions.getDatasourceItems({ id: 'no-exclude', excludeGeo: false, from: 'RefreshService.start()' })
    );
    expect(spyStore).toHaveBeenCalledWith(
      SearchActions.getDatasourceItems({ id: 'exclude', excludeGeo: true, from: 'RefreshService.start()' })
    );
    expect(spyStore).not.toHaveBeenCalledWith(
      SearchActions.getDatasourceItems({ id: 'noTrigger', excludeGeo: false, from: 'RefreshService.start()' })
    );
  });
});
