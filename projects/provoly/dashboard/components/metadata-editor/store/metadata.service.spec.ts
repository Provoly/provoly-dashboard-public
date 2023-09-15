import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors, IMetadata, VARIABLE_TYPE } from '@provoly/dashboard';

import { MetadataService } from './metadata.service';

describe('Metadata Service', () => {
  let service: MetadataService;
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
    service = TestBed.inject(MetadataService);
  });
  beforeEach(() => (httpTestingController = TestBed.get(HttpTestingController)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
});
