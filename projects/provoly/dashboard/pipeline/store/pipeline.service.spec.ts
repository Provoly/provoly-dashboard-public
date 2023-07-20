import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors } from '@provoly/dashboard';
import { PryTransfo } from '../components/pipeline-editor/pipeline.interface';

import { PipelineService } from './pipeline.service';

describe('PipelineService', () => {
  let service: PipelineService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.transfoUrl,
              value: 'transfo'
            },
            {
              selector: ConfigSelectors.execUrl,
              value: 'exec'
            }
          ]
        })
      ]
    });
    service = TestBed.inject(PipelineService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check graph', () => {
    service.check({}).subscribe();
    const req = httpTestingController.expectOne('transfo/transfos');
    expect(req.request.method).toEqual('PUT');
  });

  describe('Transformations', () => {
    let transformation = {
      id: '1',
      title: 'transfo 1',
      version: '1',
      creationDate: new Date('01-01-2023').toDateString(),
      description: '',
      active: false,
      lastJobExecution: {
        uuid: '2',
        status: 'terminated',
        executionDate: new Date('01-01-2023').toDateString()
      },
      links: [],
      nodes: []
    } as PryTransfo;

    it('should get transformations', () => {
      let transformations: PryTransfo[] = [];
      service.list().subscribe((_transfos) => (transformations = _transfos));
      const req = httpTestingController.expectOne('transfo/transfos');

      req.flush([transformation]);

      expect(transformations).not.toBeUndefined();
      expect(transformations.length).toBe(1);
    });

    it('should get a transformation by its id', () => {
      let transfo: PryTransfo = {} as PryTransfo;

      service.get(transformation.id).subscribe((_transfo) => (transfo = _transfo));
      const req = httpTestingController.expectOne('transfo/transfos/id/1');
      req.flush(transformation);

      expect(transfo.id).toBe('1');
    });

    it('should activate transformation', () => {
      service.activate(transformation.id).subscribe();
      const req = httpTestingController.expectOne('transfo/transfos/id/1/activation');
      expect(req.request.method).toEqual('POST');
    });

    it('should deactivate transformation', () => {
      service.deactivate(transformation.id).subscribe();
      const req = httpTestingController.expectOne('transfo/transfos/id/1/activation');
      expect(req.request.method).toEqual('DELETE');
    });

    it('should execute transformation', () => {
      service.execute(transformation.id).subscribe();
      const req = httpTestingController.expectOne('exec/job/instances/id/1/start');
      expect(req.request.method).toEqual('PUT');
    });
  });
});
