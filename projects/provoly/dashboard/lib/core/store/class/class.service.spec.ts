import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors } from '../config/config.selectors';
import { BusinessData } from './class.interface';
import { ClassService } from './class.service';

describe('ClassService', () => {
  let service: ClassService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.monitorUrl,
              value: 'monitor'
            }
          ]
        })
      ]
    });
    service = TestBed.inject(ClassService);
  });
  beforeEach(() => (httpTestingController = TestBed.get(HttpTestingController)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBusinessDatas', () => {
    it('should return flows', () => {
      let businessDatas: BusinessData[] = [];

      service.getBusinessDatas().subscribe((_businessDatas) => (businessDatas = _businessDatas));
      const req = httpTestingController.expectOne('monitor/businessdata');

      req.flush([
        {
          name: 'name',
          count: 45,
          date: 'date'
        } as BusinessData
      ]);

      expect(businessDatas).not.toBeUndefined();
      expect(businessDatas.length).toBe(1);
    });
  });
});
