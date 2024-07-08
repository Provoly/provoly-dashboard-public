import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ConfigSelectors,
  DEFAULT_NAMED_QUERY_ID,
  MonoClassSearchPayload,
  NamedQuery,
  PryI18nService
} from '@provoly/dashboard';
import { DataSourceService } from './data-source.service';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';
import { mockDatasetVersion } from '@provoly/dashboard/mock/data/mockDataset';
import { HttpRequest } from '@angular/common/http';

describe('NamedQueryService', () => {
  let service: DataSourceService;
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
        }),
        { provide: PryI18nService, useClass: MockPryI18nService }
      ]
    });
    service = TestBed.inject(DataSourceService);
  });
  beforeEach(() => (httpTestingController = TestBed.get(HttpTestingController)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return namedQueries', () => {
      let getPayload: any = [];

      service.get().subscribe((_getPayload) => (getPayload = _getPayload));
      const req = httpTestingController.expectOne('ref/users/me/namedquery');

      req.flush([
        {
          id: 'fakeid',
          name: 'fakename',
          description: 'fakedescription',
          request: {
            type: 'MONO_CLASS',
            fullSearch: null,
            oClass: '9e397c90-b109-423d-812b-3c4ff815ce71',
            datasetIds: null,
            condition: {
              type: 'AND',
              composed: []
            },
            sort: null
          },
          favorite: false,
          color: null,
          visibility: {
            type: 'PRIVATE',
            users: null
          },
          owner: true
        }
      ]);

      expect(getPayload).not.toBeUndefined();
      expect(getPayload.length).toBe(3);
    });
  });

  describe('post', () => {
    it('should not create on default named query id', () => {
      let postPayload: any = {};
      const namedQuery: NamedQuery = {
        id: DEFAULT_NAMED_QUERY_ID,
        sourceType: 'namedQuery',
        name: 'fakename',
        request: {
          type: 'MONO_CLASS',
          oClass: '1b13e73e-13a1-4e54-b68a-c62776657255',
          condition: {
            type: 'AND',
            composed: []
          },
          sort: null
        } as unknown as MonoClassSearchPayload
      };

      service.post(namedQuery).subscribe((_postPayload) => (postPayload = _postPayload));
      httpTestingController.expectNone('ref/users/me/namedquery');

      expect(postPayload).not.toBeUndefined();
      expect(postPayload.data.success).toBeTruthy();
    });
    it('should return namedQuery with 2 default named queries', () => {
      let postPayload: any = {};
      const namedQuery: NamedQuery = {
        id: 'fakeid',
        sourceType: 'namedQuery',
        name: 'fakename',
        request: {
          type: 'MONO_CLASS',
          oClass: '1b13e73e-13a1-4e54-b68a-c62776657255',
          condition: {
            type: 'AND',
            composed: []
          },
          sort: null
        } as unknown as MonoClassSearchPayload
      };

      service.post(namedQuery).subscribe((_postPayload) => (postPayload = _postPayload));
      const req = httpTestingController.expectOne('ref/users/me/namedquery');

      req.flush(namedQuery);

      expect(postPayload).not.toBeUndefined();
      expect(postPayload.id).toBe('fakeid');
    });
  });

  describe('delete', () => {
    it('should call delete', () => {
      service.delete('fakeid').subscribe(() => {});

      httpTestingController.expectOne('ref/users/me/namedquery/fakeid');
    });
  });

  describe('addFavorite', () => {
    it('should call add favorite', () => {
      service.addFavorite('fakeid').subscribe(() => {});

      httpTestingController.expectOne('ref/users/me/namedquery/fakeid/favorite');
    });
  });

  describe('deleteFavorite', () => {
    it('should call delete favorite', () => {
      service.deleteFavorite('fakeid').subscribe(() => {});

      httpTestingController.expectOne('ref/users/me/namedquery/fakeid/favorite');
    });
  });

  describe('getDatasetVersions', () => {
    it('should get versions of all datasets', () => {
      service
        .getDatasetVersions({
          dataset: 'fakeid',
          limit: 10,
          offset: 0
        })
        .subscribe(() => {});

      const req = httpTestingController.expectOne((request: HttpRequest<any>) => {
        return request.url === 'ref/dataset-versions';
      });

      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('dataset')).toEqual('fakeid');
      expect(req.request.params.get('limit')).toEqual('10');
      expect(req.request.params.get('offset')).toEqual('0');
      expect(req.request.method).toEqual('GET');
      req.flush([mockDatasetVersion]);
    });
  });

  describe('getDatasetVersionsById', () => {
    it('should get versions by datasetId', () => {
      service.getDatasetVersionsById('fakeid').subscribe(() => {});

      httpTestingController.expectOne(`ref/datasets/id/fakeid/dataset-versions`);
    });
  });
});
