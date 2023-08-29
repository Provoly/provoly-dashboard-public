import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Associations, ConfigSelectors, IMetadata, Predicate, VARIABLE_TYPE } from '@provoly/dashboard';

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

  describe('Metadata', () => {
    let metadata: IMetadata = {
      id: '9d9aba2c-fc3a-44d7-a508-287ad2d8cbb0',
      name: '_class',
      type: VARIABLE_TYPE.UUID
    };

    it('should return metadata', () => {
      let metadata: Array<IMetadata> = [];

      service.getMetadataList().subscribe((_metadata) => (metadata = _metadata));
      const req = httpTestingController.expectOne('ref/metadata');

      req.flush([
        {
          id: '9d9aba2c-fc3a-44d7-a508-287ad2d8cbb0',
          name: '_class',
          type: VARIABLE_TYPE.UUID
        } as IMetadata
      ]);

      expect(metadata).not.toBeUndefined();
      expect(metadata.length).toBe(1);
    });

    it('should update metadata', () => {
      service.postMetadata(metadata).subscribe(() => {});
      const req = httpTestingController.expectOne('ref/metadata');

      req.flush({
        id: '9d9aba2c-fc3a-44d7-a508-287ad2d8cbb0',
        name: '_class_changed',
        type: 'UUID'
      });
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
      let associations: Associations | undefined;

      service.getClassAssociations(classId).subscribe((_associations) => {
        associations = _associations;
      });

      const req = httpTestingController.expectOne(`ref/model/class/${classId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAssociations);

      expect(associations).toBeDefined();
    });
  });
  describe('getAssociationsDataset', () => {
    const datasetId = 'dataset123';
    const mockAssociations: {} = {
      id: 'dataset123',
      associations: [
        {
          id: '12345',
          name: 'test association dataset',
          type: 'dataset'
        }
      ],
      usedElsewhere: true
    };

    it('should get associations for a dataset', () => {
      let associations: Associations | undefined;

      service.getDatasetAssociations(datasetId).subscribe((_associations) => {
        associations = _associations;
      });

      const req = httpTestingController.expectOne(`ref/datasets/${datasetId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAssociations);

      expect(associations).toBeDefined();
    });
  });
  describe('getAssociationsField', () => {
    const fieldId = 'field123';
    const mockAssociations: {} = {
      id: 'field123',
      associations: [
        {
          id: '12345',
          name: 'test association field',
          type: 'dataset'
        }
      ],
      usedElsewhere: true
    };

    it('should get associations for a field', () => {
      let associations: Associations | undefined;

      service.getFieldAssociations(fieldId).subscribe((_associations) => {
        associations = _associations;
      });

      const req = httpTestingController.expectOne(`ref/model/fields/${fieldId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAssociations);

      expect(associations).toBeDefined();
    });
  });
  describe('getAssociationsAttribute', () => {
    const AttributeId = 'Attribute123';
    const mockAssociations: {} = {
      id: 'Attribute123',
      associations: [
        {
          id: '12345',
          name: 'test association Attribute',
          type: 'dataset'
        }
      ],
      usedElsewhere: true
    };

    it('should get associations for a Attribute', () => {
      let associations: Associations | undefined;

      service.getAttributeAssociations(AttributeId).subscribe((_associations) => {
        associations = _associations;
      });

      const req = httpTestingController.expectOne(`ref/model/attribute/${AttributeId}/associations`);
      expect(req.request.method).toBe('GET');

      req.flush(mockAssociations);

      expect(associations).toBeDefined();
    });
  });
});
