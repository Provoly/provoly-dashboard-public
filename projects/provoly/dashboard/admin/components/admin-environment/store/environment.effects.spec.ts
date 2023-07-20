import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Environment, VARIABLE_TYPE } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { EnvironmentActions } from './environment.actions';
import { EnvironmentEffects } from './environment.effects';
import { EnvironmentState, initialEnvironmentState } from './environment.reducer';

const buildState = (state: Partial<EnvironmentState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialEnvironmentState, ...state })) });

const envs: Environment[] = [
  {
    name: 'myEnv',
    value: 'value',
    type: VARIABLE_TYPE.STRING
  }
];

const routeLoadEnv = '/';

describe('EnvironmentEffects', () => {
  let actions$: Observable<any>;
  let effects: EnvironmentEffects;
  let adminService: AdminService;
  const initialState = initialEnvironmentState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        EnvironmentEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getEnvironments: () => of(envs),
            getNextAvailableNum: () => of(2),
            getEnvironment: () => of(envs[0]),
            saveEnvironment: () => of(''),
            deleteEnvironment: () => of(envs[0])
          }
        }
      ]
    });

    effects = TestBed.inject(EnvironmentEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('loadEnvironment$', () => {
    it('should set Environment get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getEnvironments');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.loadEnvironments()
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.loadEnvironmentsSuccess({ datas: envs })
      });
      expect(effects.loadEnvironments$).toBeObservable(expected$);
      expect(effects.loadEnvironments$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadEnvironment failure', () => {
      const getSpy = jest.spyOn(adminService, 'getEnvironments').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.loadEnvironments()
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.loadEnvironmentsFailure({ error: new Error('error') })
      });
      expect(effects.loadEnvironments$).toBeObservable(expected$);
      expect(effects.loadEnvironments$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('saveEnvironment$', () => {
    it('should call saveEnvironmentSuccess', () => {
      const getSpy = jest.spyOn(adminService, 'saveEnvironment');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.saveEnvironment({ env: envs[0], route: routeLoadEnv })
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.saveEnvironmentSuccess({ route: routeLoadEnv })
      });
      expect(effects.saveEnvironment$).toBeObservable(expected$);
      expect(effects.saveEnvironment$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call saveEnvironmentFailure', () => {
      const getSpy = jest.spyOn(adminService, 'saveEnvironment').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.saveEnvironment({ env: envs[0], route: routeLoadEnv })
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.saveEnvironmentFailure({ error: new Error('error') })
      });
      expect(effects.saveEnvironment$).toBeObservable(expected$);
      expect(effects.saveEnvironment$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('saveEnvironmentSucess$', () => {
    it('should route to load Environment', () => {
      actions$ = hot('--a-', {
        a: EnvironmentActions.saveEnvironmentSuccess({ route: routeLoadEnv })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: routeLoadEnv })
      });
      expect(effects.saveEnvironmentSuccess$).toBeObservable(expected$);
    });
  });
  describe('selectEnvironment$', () => {
    it('should set current env get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getEnvironment');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.selectEnvironment({ name: 'myEnv' })
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.selectEnvironmentSuccess({ data: envs[0] })
      });
      expect(effects.selectEnvironment$).toBeObservable(expected$);
      expect(effects.selectEnvironment$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call selectEnvironment failure', () => {
      const getSpy = jest.spyOn(adminService, 'getEnvironment').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.selectEnvironment({ name: 'myEnv' })
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.selectEnvironmentFailure({ error: new Error('error') })
      });
      expect(effects.selectEnvironment$).toBeObservable(expected$);
      expect(effects.selectEnvironment$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('deleteEnvironment$', () => {
    it('should call deleteEnvironmentSuccess', () => {
      const getSpy = jest.spyOn(adminService, 'deleteEnvironment');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.deleteEnvironment({ name: envs[0]['name'], route: routeLoadEnv, addRoute: 'new' })
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.deleteEnvironmentSuccess({ route: routeLoadEnv, addRoute: 'new' })
      });
      expect(effects.deleteEnvironment$).toBeObservable(expected$);
      expect(effects.deleteEnvironment$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call deleteEnvironmentFailure', () => {
      const getSpy = jest
        .spyOn(adminService, 'deleteEnvironment')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: EnvironmentActions.deleteEnvironment({ name: envs[0]['name'], route: routeLoadEnv, addRoute: 'new' })
      });

      const expected$ = hot('--a-', {
        a: EnvironmentActions.deleteEnvironmentFailure({ error: new Error('error') })
      });
      expect(effects.deleteEnvironment$).toBeObservable(expected$);
      expect(effects.deleteEnvironment$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('deleteEnvironmentSucess$', () => {
    it('should update environments list', () => {
      actions$ = hot('--a-', {
        a: EnvironmentActions.deleteEnvironmentSuccess({ route: routeLoadEnv, addRoute: 'new' })
      });

      const expected$ = hot('--(abc)-', {
        a: EnvironmentActions.loadEnvironments(),
        b: AdminActions.selectComponentType({ componentType: null }),
        c: AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: 'new' }),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'environment',
              actionAccess: 'write'
            }
          ]
        })
      });
      expect(effects.deleteEnvironmentSuccess$).toBeObservable(expected$);
    });
  });
});
