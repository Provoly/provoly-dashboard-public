import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Associations, ConfigSelectors, Predicate } from '@provoly/dashboard';
import { associations } from '@provoly/dashboard/mock/data/mockItemAdmin';

import { AdminService } from './admin.service';

describe('Admin Service', () => {
  let service: AdminService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.refUrl,
              value: 'ref'
            }
          ]
        })
      ]
    });
    service = TestBed.inject(AdminService);
  });
  beforeEach(() => (httpTestingController = TestBed.get(HttpTestingController)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Predicates', () => {
    const mockPredicate = {
      id: '1',
      name: 'predicate',
      value: 'valuepredicate'
    } as Predicate;

    it('should get predicates', () => {
      let predicates: Predicate[] = [];

      service.getPredicates().subscribe((_predicates) => (predicates = _predicates));
      const req = httpTestingController.expectOne('ref/predicates');

      req.flush([mockPredicate]);

      expect(predicates).not.toBeUndefined();
      expect(predicates.length).toBe(1);
    });

    it('get current Predicate', () => {
      let predicate = {} as Predicate;
      let num = '1';
      service.getPredicate(num).subscribe((_predicate) => (predicate = _predicate));
      const req = httpTestingController.expectOne(`ref/predicates/id/${num}`);

      req.flush(mockPredicate);

      expect(predicate).not.toBeUndefined();
      expect(predicate.name).toEqual('predicate');
    });

    it('should add new predicate', () => {
      service.savePredicate(mockPredicate).subscribe(() => {});
      const req = httpTestingController.expectOne('ref/predicates');

      req.flush({});
    });
  });

  describe('getAssociationsClass', () => {
    const classId = 'class123';
    const mockAssociations: {} = {
      id: 'class123',
      associations: [
        {
          id: '12345',
          name: 'test association class',
          type: 'dataset'
        }
      ],
      usedElsewhere: true
    };

    it('should get associations for a class', () => {
      let association: Associations | undefined;

      service.getClassAssociations(classId).subscribe((_associations) => {
        association = _associations;
      });

      const req = httpTestingController.expectOne(`ref/model/class/${classId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(associations);

      expect(association).toBeDefined();
    });
  });
  describe('getAssociationsDataset', () => {
    const datasetId = 'dataset123';
    it('should get associations for a dataset', () => {
      let association: Associations | undefined;

      service.getDatasetAssociations(datasetId).subscribe((_associations) => {
        association = _associations;
      });

      const req = httpTestingController.expectOne(`ref/datasets/${datasetId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(associations);

      expect(association).toBeDefined();
    });
  });
  describe('getAssociationsField', () => {
    const fieldId = 'field123';
    it('should get associations for a field', () => {
      let association: Associations | undefined;

      service.getFieldAssociations(fieldId).subscribe((_associations) => {
        association = _associations;
      });

      const req = httpTestingController.expectOne(`ref/model/fields/${fieldId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(associations);

      expect(association).toBeDefined();
    });
  });
  describe('getAssociationsAttribute', () => {
    const AttributeId = 'Attribute123';
    it('should get associations for a Attribute', () => {
      let association: Associations | undefined;

      service.getAttributeAssociations(AttributeId).subscribe((_associations) => {
        association = _associations;
      });

      const req = httpTestingController.expectOne(`ref/model/attribute/${AttributeId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(associations);

      expect(association).toBeDefined();
    });
  });
});
