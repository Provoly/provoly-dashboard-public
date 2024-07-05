import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors, Field, FieldType } from '@provoly/dashboard';

import { FieldService } from './field.service';

const mockField: Field = {
  id: 'id-1',
  name: 'string-field',
  type: FieldType.STRING
};

describe('FieldService', () => {
  let service: FieldService;
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
    service = TestBed.inject(FieldService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get fields', () => {
    let fields: Field[] = [];
    service.getFields().subscribe((_fields) => (fields = _fields));

    const req = httpTestingController.expectOne('ref/model/fields');
    req.flush([mockField]);

    expect(fields).not.toBeUndefined();
    expect(fields.length).toBe(1);
  });

  it('should save field', () => {
    service.saveField(mockField).subscribe();

    const req = httpTestingController.expectOne('ref/model/fields');
    expect(req.request.method).toEqual('POST');
    req.flush({});
  });

  it('should update field', () => {
    service.updateField(mockField).subscribe();

    const req = httpTestingController.expectOne('ref/model/fields/id-1');
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  });

  it('should delete field', () => {
    service.deleteField(mockField.id).subscribe();

    const req = httpTestingController.expectOne(`ref/model/fields/${mockField.id}`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
