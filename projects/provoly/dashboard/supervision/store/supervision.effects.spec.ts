import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BusinessData, PryI18nService, PrySnackbarService } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { Infrastructure, InputFlow, IntegrationError } from './supervision-api.model';
import { SupervisionActions } from './supervision.actions';
import { SupervisionEffects } from './supervision.effects';
import { initialSupervisionState, SupervisionState } from './supervision.reducer';
import { SupervisionService } from './supervision.service';

const buildState = (state: Partial<SupervisionState>) =>
  Object.assign({}, { '@pry/supervision': JSON.parse(JSON.stringify({ ...initialSupervisionState, ...state })) });
const infras: Infrastructure[] = [
  {
    available: 1,
    hotScale: true,
    maxReplicas: 12,
    minReplicas: 0,
    missing: false,
    name: 'name',
    replicas: 1,
    title: 'title'
  }
];
const flows: InputFlow[] = [
  {
    name: 'name',
    dateIntegration: 'date',
    format: 'format',
    idFlow: 'id',
    accessLink: 'link',
    nbIntegrationKo: 1,
    nbIntegrationOk: 1,
    status: true,
    startProcessorLink: 'link',
    stopProcessorLink: 'link'
  }
];
const datas: BusinessData[] = [
  {
    name: 'name',
    count: 45,
    date: 'date'
  }
];
const errors: IntegrationError[] = [
  {
    oClass: 'oclass23',
    errors: [
      {
        label: 'unknown error',
        count: 93
      }
    ]
  }
];

describe('SupervisionEffects', () => {
  PryI18nService.warn = false;
  let actions$: Observable<any>;
  let effects: SupervisionEffects;
  let supervisionService: SupervisionService;
  let snackbarService: PrySnackbarService;
  const initialState = initialSupervisionState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'path', redirectTo: '' }])],
      providers: [
        SupervisionEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: SupervisionService,
          useValue: {
            getInfrastructures: () => of(infras),
            getInputFlows: () => of(flows),
            getBusinessDatas: () => of(datas),
            scaleInfra: () => of(''),
            manageInputFlowsStatus: () => of(''),
            getDateIso: () => 'date',
            getIntegrationErrors: () => of(errors),
            reloadErrors: () => of(''),
            acknowledgeErrors: () => of('')
          }
        },
        {
          provide: PrySnackbarService,
          useValue: {
            open: () => null
          }
        }
      ]
    });

    effects = TestBed.inject(SupervisionEffects);
    supervisionService = TestBed.inject<SupervisionService>(SupervisionService);
    snackbarService = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('routeTo$', () => {
    it('should call navigate with param path without params', () => {
      const getSpy = jest.spyOn(router, 'navigate');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.routeTo({ path: 'path' })
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.resetActions()
      });
      expect(effects.routeTo$).toBeObservable(expected$);
      expect(effects.routeTo$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
        expect(getSpy.mock.calls[0]).toEqual([['path'], { queryParams: undefined }]);
      });
    });
    it('should call navigate with param path with params', () => {
      const getSpy = jest.spyOn(router, 'navigate');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.routeTo({ path: 'path', params: { toto: 'toto' } })
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.resetActions()
      });
      expect(effects.routeTo$).toBeObservable(expected$);
      expect(effects.routeTo$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
        expect(getSpy.mock.calls[0]).toEqual([['path'], { queryParams: { toto: 'toto' } }]);
      });
    });
  });
  describe('loadInfras$', () => {
    it('should set infras get by the http GET', () => {
      const getSpy = jest.spyOn(supervisionService, 'getInfrastructures');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.loadInfras()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadInfrasSuccess({ infras: infras })
      });
      expect(effects.loadInfras$).toBeObservable(expected$);
      expect(effects.loadInfras$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call load infra failure', () => {
      const getSpy = jest
        .spyOn(supervisionService, 'getInfrastructures')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.loadInfras()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadInfrasFailure({ error: new Error('error') })
      });
      expect(effects.loadInfras$).toBeObservable(expected$);
      expect(effects.loadInfras$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('scaleInfra$', () => {
    it('should call scale infra success', () => {
      const getSpy = jest.spyOn(supervisionService, 'scaleInfra');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.scaleInfra({ name: 'name', scale: 1, up: true })
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.scaleInfraSuccess({ name: 'name', time: 'date', up: true })
      });
      expect(effects.scaleInfra$).toBeObservable(expected$);
      expect(effects.scaleInfra$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call scale infra failure', () => {
      const getSpy = jest.spyOn(supervisionService, 'scaleInfra').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.scaleInfra({ name: 'name', scale: 1, up: true })
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.scaleInfraFailure({ error: new Error('error') })
      });
      expect(effects.scaleInfra$).toBeObservable(expected$);
      expect(effects.scaleInfra$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('scaleInfraSuccess$', () => {
    it('should load infras after scale infra success', () => {
      const getSpy = jest.spyOn(snackbarService, 'open');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.scaleInfraSuccess({ name: 'name', time: 'date', up: true })
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadInfras()
      });
      expect(effects.scaleInfraSuccess$).toBeObservable(expected$);
      expect(effects.scaleInfraSuccess$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('loadFlows$', () => {
    it('should set flows get by the http GET', () => {
      const getSpy = jest.spyOn(supervisionService, 'getInputFlows');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.loadFlows()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadFlowsSuccess({ flows: flows })
      });
      expect(effects.loadFlows$).toBeObservable(expected$);
      expect(effects.loadFlows$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call load infra failure', () => {
      const getSpy = jest
        .spyOn(supervisionService, 'getInputFlows')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.loadFlows()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadFlowsFailure({ error: new Error('error') })
      });
      expect(effects.loadFlows$).toBeObservable(expected$);
      expect(effects.loadFlows$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('loadIntegrationErrors$', () => {
    it('should set integration errors get by the http GET', () => {
      const getSpy = jest.spyOn(supervisionService, 'getIntegrationErrors');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.loadIntegrationErrors()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadIntegrationErrorsSuccess({ integrationErrors: errors })
      });
      expect(effects.loadIntegrationErrors$).toBeObservable(expected$);
      expect(effects.loadIntegrationErrors$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call load integration errors failure', () => {
      const getSpy = jest
        .spyOn(supervisionService, 'getIntegrationErrors')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.loadIntegrationErrors()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadIntegrationErrorsFailure({ error: new Error('error') })
      });
      expect(effects.loadIntegrationErrors$).toBeObservable(expected$);
      expect(effects.loadIntegrationErrors$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('reloadErrors$', () => {
    it('should reload errors by the http POST', () => {
      const getSpy = jest.spyOn(supervisionService, 'reloadErrors');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.reloadErrors()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.reloadErrorsSuccess()
      });
      expect(effects.reloadErrors$).toBeObservable(expected$);
      expect(effects.reloadErrors$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call reload errors failure', () => {
      const getSpy = jest
        .spyOn(supervisionService, 'reloadErrors')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.reloadErrors()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.reloadErrorsFailure({ error: new Error('error') })
      });
      expect(effects.reloadErrors$).toBeObservable(expected$);
      expect(effects.reloadErrors$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('reloadErrorsSuccess$', () => {
    it('should load errors after reload success', () => {
      const getSpy = jest.spyOn(snackbarService, 'open');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.reloadErrorsSuccess()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadIntegrationErrors()
      });
      expect(effects.reloadErrorsSuccess$).toBeObservable(expected$);
      expect(effects.reloadErrorsSuccess$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('acknowledgeErrors', () => {
    it('should acknowledge errors by the http POST', () => {
      const getSpy = jest.spyOn(supervisionService, 'acknowledgeErrors');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.acknowledgeErrors()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.acknowledgeErrorsSuccess()
      });
      expect(effects.acknowledgeErrors$).toBeObservable(expected$);
      expect(effects.acknowledgeErrors$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call acknowledge errors failure', () => {
      const getSpy = jest
        .spyOn(supervisionService, 'acknowledgeErrors')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.acknowledgeErrors()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.acknowledgeErrorsFailure({ error: new Error('error') })
      });
      expect(effects.acknowledgeErrors$).toBeObservable(expected$);
      expect(effects.acknowledgeErrors$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('acknowledgeErrorsSuccess$', () => {
    it('should load errors after reload success', () => {
      const getSpy = jest.spyOn(snackbarService, 'open');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: SupervisionActions.acknowledgeErrorsSuccess()
      });

      const expected$ = hot('--a-', {
        a: SupervisionActions.loadIntegrationErrors()
      });
      expect(effects.acknowledgeErrorsSuccess$).toBeObservable(expected$);
      expect(effects.acknowledgeErrorsSuccess$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
