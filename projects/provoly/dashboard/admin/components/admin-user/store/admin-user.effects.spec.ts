import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { metadataUser, users } from '../../../../mock/data/mockItemAdmin';
import { AdminService } from '../../../store/admin.service';
import { AdminUserActions } from './admin-user.action';
import { AdminUserEffects } from './admin-user.effects';
import { AdminUserState, initialAdminUserState } from './admin-user.reducer';

const buildState = (state: Partial<AdminUserState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialAdminUserState, ...state })) });

describe('AdminUserEffects', () => {
  let actions$: Observable<any>;
  let effects: AdminUserEffects;
  let adminService: AdminService;
  const initialState = initialAdminUserState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminUserEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getUsers: () => of(users),
            getMetadataUser: () => of(metadataUser),
            addMetadataUser: () => of(''),
            deleteMetadataUser: () => of('')
          }
        }
      ]
    });

    effects = TestBed.inject(AdminUserEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('loadUsers$', () => {
    it('should set Users get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getUsers');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.loadUsers()
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.loadUsersSuccess({ users: users })
      });
      expect(effects.loadUsers$).toBeObservable(expected$);
      expect(effects.loadUsers$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadUser failure', () => {
      const getSpy = jest.spyOn(adminService, 'getUsers').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.loadUsers()
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.loadUsersFailure({ error: new Error('error') })
      });
      expect(effects.loadUsers$).toBeObservable(expected$);
      expect(effects.loadUsers$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('loadMetadataUser$', () => {
    it('should set Metadata Users get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getMetadataUser');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.loadMetadataUser({ userId: 'idBuffy' })
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.loadMetadataUserSuccess({ metadata: metadataUser })
      });
      expect(effects.loadMetadataUser$).toBeObservable(expected$);
      expect(effects.loadMetadataUser$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadMetadataUser failure', () => {
      const getSpy = jest.spyOn(adminService, 'getMetadataUser').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.loadMetadataUser({ userId: 'idBuffy' })
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.loadMetadataUserFailure({ error: new Error('error') })
      });
      expect(effects.loadMetadataUser$).toBeObservable(expected$);
      expect(effects.loadMetadataUser$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('selectUser$', () => {
    it('should set Metadata Users get by the http GET', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.selectUser({ userId: 'idBuffy' })
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.loadMetadataUser({ userId: 'idBuffy' })
      });
      expect(effects.selectUser$).toBeObservable(expected$);
    });
  });

  describe('addMetadataUser$', () => {
    it('should add Metadata Users get by the http PUT', () => {
      const getSpy = jest.spyOn(adminService, 'addMetadataUser');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.addMetadataUser({
          userId: 'idBuffy',
          metaId: metadataUser[0].userProfile.id,
          value: 'toto'
        })
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.addMetadataUserSuccess({ userId: 'idBuffy' })
      });
      expect(effects.addMetadataUser$).toBeObservable(expected$);
      expect(effects.addMetadataUser$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call addMetadataUser failure', () => {
      const getSpy = jest.spyOn(adminService, 'addMetadataUser').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.addMetadataUser({
          userId: 'idBuffy',
          metaId: metadataUser[0].userProfile.id,
          value: 'toto'
        })
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.addMetadataUserFailure({ error: new Error('error') })
      });
      expect(effects.addMetadataUser$).toBeObservable(expected$);
      expect(effects.addMetadataUser$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('addMetadataUserSuccess$', () => {
    it('should set Metadata Users get by the http GET', () => {
      store.setState(
        buildState({
          ...initialState,
          selectedMetadataUser: []
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.addMetadataUserSuccess({ userId: 'idBuffy' })
      });

      const expected$ = hot('--(ab)-', {
        a: AdminUserActions.loadMetadataUser({ userId: 'idBuffy' }),
        b: AdminUserActions.isEditable({ editable: false })
      });
      expect(effects.addMetadataUserSuccess$).toBeObservable(expected$);
    });
  });

  describe('deleteMetadataUser$', () => {
    it('should add Metadata Users get by the http PUT', () => {
      const getSpy = jest.spyOn(adminService, 'deleteMetadataUser');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.deleteMetadataUser({ userId: 'idBuffy', metadataId: metadataUser[0].userProfile.id })
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.deleteMetadataUserSuccess({ userId: 'idBuffy' })
      });
      expect(effects.deleteMetadataUser$).toBeObservable(expected$);
      expect(effects.deleteMetadataUser$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call deleteMetadataUser failure', () => {
      const getSpy = jest
        .spyOn(adminService, 'deleteMetadataUser')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.deleteMetadataUser({ userId: 'idBuffy', metadataId: metadataUser[0].userProfile.id })
      });

      const expected$ = hot('--a-', {
        a: AdminUserActions.deleteMetadataUserFailure({ error: new Error('error') })
      });
      expect(effects.deleteMetadataUser$).toBeObservable(expected$);
      expect(effects.deleteMetadataUser$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('deleteMetadataUserSuccess$', () => {
    it('should set Metadata Users get by the http GET', () => {
      store.setState(
        buildState({
          ...initialState,
          selectedMetadataUser: []
        })
      );

      actions$ = hot('--a-', {
        a: AdminUserActions.deleteMetadataUserSuccess({ userId: 'idBuffy' })
      });

      const expected$ = hot('--(ab)-', {
        a: AdminUserActions.loadMetadataUser({ userId: 'idBuffy' }),
        b: AdminUserActions.isEditable({ editable: false })
      });
      expect(effects.deleteMetadataUserSuccess$).toBeObservable(expected$);
    });
  });
});
