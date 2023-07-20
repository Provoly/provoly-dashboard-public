import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors } from '@provoly/dashboard';
import { Infrastructure, InputFlow, IntegrationError } from './supervision-api.model';
import { SupervisionService } from './supervision.service';

describe('SupervisionService', () => {
  let service: SupervisionService;
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
            },
            {
              selector: ConfigSelectors.replayUrl,
              value: 'replay'
            }
          ]
        })
      ]
    });
    service = TestBed.inject(SupervisionService);
  });
  beforeEach(() => (httpTestingController = TestBed.get(HttpTestingController)));

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getInfrastructures', () => {
    it('should return infras', () => {
      let infras: Infrastructure[] = [];

      service.getInfrastructures().subscribe((_infras) => (infras = _infras));
      const req = httpTestingController.expectOne('monitor/status');

      req.flush([
        {
          available: 1,
          hotScale: true,
          maxReplicas: 10,
          minReplicas: 1,
          missing: false,
          name: 'name',
          replicas: 1,
          title: 'title'
        } as Infrastructure
      ]);

      expect(infras).not.toBeUndefined();
      expect(infras.length).toBe(1);
    });
  });
  describe('scaleInfra', () => {
    it('should scale infras', () => {
      service.scaleInfra('name', 2).subscribe(() => {});
      const req = httpTestingController.expectOne('monitor/replicas/name?scale=2');

      req.flush({});
    });
  });

  describe('getInputFlows', () => {
    it('should return flows', () => {
      let flows: InputFlow[] = [];

      service.getInputFlows().subscribe((_flows) => (flows = _flows));
      const req = httpTestingController.expectOne('monitor/supervision/nifi/monitoringInputFlow');

      req.flush([
        {
          idFlow: 'id',
          name: 'name',
          dateIntegration: 'date',
          format: 'format',
          accessLink: 'link',
          nbIntegrationKo: 1,
          nbIntegrationOk: 1,
          status: true,
          startProcessorLink: 'link',
          stopProcessorLink: 'link'
        } as InputFlow
      ]);

      expect(flows).not.toBeUndefined();
      expect(flows.length).toBe(1);
    });
  });

  describe('getDateIso', () => {
    it('should return date not null', () => {
      const date = service.getDateIso();
      const regex = expect(date.match('[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\\.[0-9]+Z')).toBeDefined();
    });
  });

  describe('getIntegrationErrors', () => {
    it('should return integration errors', () => {
      let errors: IntegrationError[] = [];

      service.getIntegrationErrors().subscribe((_errors) => (errors = _errors));
      const req = httpTestingController.expectOne('replay/integrations/errors');

      req.flush([
        {
          oClass: '534ff6cd-0a85-4612-82c0-7f83e9ce2caa',
          errors: [
            {
              label: 'error1',
              count: 24
            },
            {
              label: 'error2',
              count: 10
            }
          ]
        } as IntegrationError
      ]);

      expect(errors).not.toBeUndefined();
      expect(errors.length).toBe(1);
    });
  });

  describe('reloadIntegrationErrors', () => {
    it('should reload integration errors of selected classes', () => {
      let classes: string[] = ['534ff6cd-0a85-4612-82c0-7f83e9ce2caa'];
      service.reloadErrors(classes).subscribe(() => {});
      httpTestingController.expectOne('replay/integrations/errors/replay/class');
    });
  });

  describe('acknowledgeIntegrationErrors', () => {
    it('should acknowledge integration errors of selected classes', () => {
      let classes: string[] = ['534ff6cd-0a85-4612-82c0-7f83e9ce2caa'];
      service.acknowledgeErrors(classes).subscribe(() => {});
      httpTestingController.expectOne('replay/integrations/errors/acknowledge');
    });
  });
});
