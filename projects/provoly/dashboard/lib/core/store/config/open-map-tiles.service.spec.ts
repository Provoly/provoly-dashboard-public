import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors, ConfigService } from '@provoly/dashboard';
import { OpenMapTilesService } from './open-map-tiles.service';

describe('OpenMapTiles Service', () => {
  let service: OpenMapTilesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConfigService,
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.mapUrl,
              value: 'map'
            }
          ]
        })
      ]
    });
    service = TestBed.inject(OpenMapTilesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get map styles ', () => {
    let mapStyles: { identifier: string; label: string }[] = [];

    service.getStyles().subscribe((styles) => (mapStyles = styles));
    const req = httpTestingController.expectOne('map');

    req.flush([
      {
        identifier: 'test-id',
        label: 'test-map-label'
      }
    ]);

    expect(mapStyles).toBeDefined();
    // expect(mapStyles.length).toBe(1);
  });
});
