import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardSelectors } from '../../dashboard/store/dashboard.selectors';

import { ToolboxManifestService } from './toolbox-manifest.service';

describe('ToolboxManifestService', () => {
  let service: ToolboxManifestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.defaultDatasourceNames,
              value: ['result']
            }
          ]
        })
      ]
    });
    service = TestBed.inject(ToolboxManifestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should give basic widget templates', () => {
    expect(service.get('table')).toEqual({
      layout: {
        height: 2,
        width: 3,
        x: 1,
        y: 1
      },
      options: {},
      datasource: [],
      type: 'table'
    });
  });

  it('should allow basic widget templates to be modified', () => {
    service.set('table', {
      layout: {
        height: 4,
        width: 2,
        x: 3,
        y: 10
      },
      options: { columns: [] },
      datasource: [],
      type: 'table'
    });

    expect(service.get('table')).toEqual({
      layout: {
        height: 4,
        width: 2,
        x: 3,
        y: 10
      },
      options: { columns: [] },
      datasource: [],
      type: 'table'
    });
  });

  it('should allow all widgets layout to be modified at once', () => {
    service.setAllLayouts({
      height: 3,
      width: 3,
      x: 3,
      y: 3
    });

    expect(service.get('table').layout).toEqual({
      height: 3,
      width: 3,
      x: 3,
      y: 3
    });
    expect(service.get('bubblemap').layout).toEqual({
      height: 3,
      width: 3,
      x: 3,
      y: 3
    });
  });
});
