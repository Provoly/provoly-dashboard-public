import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { metadata } from '../../../../mock/data/mockItemAdmin';
import { AdminService } from '../../../store/admin.service';
import { AdminMetadataUserActions } from './admin-metadata-user.action';
import { AdminMetadataUserEffects } from './admin-metadata-user.effects';
import { AdminMetadataUserState, initialAdminUserState } from './admin-metadata-user.reducer';
import { AdminMetadataUserSelectors } from './admin-metadata-user.selector';

const buildState = (state: Partial<AdminMetadataUserState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialAdminUserState, ...state })) });

describe('MetadataEffects', () => {
  let actions$: Observable<any>;
  let effects: AdminMetadataUserEffects;
  let adminService: AdminService;
  const initialState = initialAdminUserState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminMetadataUserEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getMetadata: () => of(metadata),
            getUserMetadata: () => of(metadata),
            updateMetadata: () => of(null),
            createMetadata: () => of(null),
            postUserMetadata: () => of(null)
          }
        }
      ]
    });

    effects = TestBed.inject(AdminMetadataUserEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('loadMetadata$', () => {
    it('should set metadata get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getUserMetadata');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminMetadataUserActions.loadMetadata()
      });

      const expected$ = hot('--a-', {
        a: AdminMetadataUserActions.loadMetadataSuccess({ metadata: metadata })
      });
      expect(effects.loadMetadata$).toBeObservable(expected$);
      expect(effects.loadMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadMetadata failure', () => {
      const getSpy = jest.spyOn(adminService, 'getUserMetadata').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminMetadataUserActions.loadMetadata()
      });

      const expected$ = hot('--a-', {
        a: AdminMetadataUserActions.loadMetadataFailure({ error: new Error('error') })
      });
      expect(effects.loadMetadata$).toBeObservable(expected$);
      expect(effects.loadMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('updateMetadata$', () => {
    it('should call updateMetadata$', () => {
      const getSpy = jest.spyOn(adminService, 'postUserMetadata');
      store.setState(
        buildState({
          ...initialState
        })
      );

      AdminMetadataUserSelectors.selectedMetadata.setResult(metadata[0]);

      actions$ = hot('--a-', {
        a: AdminMetadataUserActions.updateMetadata({ metadata: metadata[0] })
      });

      const expected$ = hot('--a-', {
        a: AdminMetadataUserActions.updateMetadataSuccess({
          metadata: metadata[0]
        })
      });
      expect(effects.updateMetadata$).toBeObservable(expected$);
      expect(effects.updateMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call updateMetadata failure', () => {
      const getSpy = jest.spyOn(adminService, 'postUserMetadata').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminMetadataUserActions.updateMetadata({ metadata: metadata[0] })
      });

      const expected$ = hot('--a-', {
        a: AdminMetadataUserActions.updateMetadataFailure({ error: new Error('error') })
      });
      expect(effects.updateMetadata$).toBeObservable(expected$);
      expect(effects.updateMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('createMetadata$', () => {
    it('should call createMetadataSuccess', () => {
      const getSpy = jest.spyOn(adminService, 'postUserMetadata');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminMetadataUserActions.createMetadata({ metadata: metadata[0] })
      });

      const expected$ = hot('--a-', {
        a: AdminMetadataUserActions.createMetadataSuccess({ metadata: metadata[0] })
      });
      expect(effects.createMetadata$).toBeObservable(expected$);
      expect(effects.createMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call createMetadata failure', () => {
      const getSpy = jest.spyOn(adminService, 'postUserMetadata').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminMetadataUserActions.createMetadata({ metadata: metadata[0] })
      });

      const expected$ = hot('--a-', {
        a: AdminMetadataUserActions.createMetadataFailure({ error: new Error('error') })
      });
      expect(effects.createMetadata$).toBeObservable(expected$);
      expect(effects.createMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
