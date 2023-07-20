import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IMetadata, VARIABLE_TYPE } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { MetadataActions } from './metadata.action';
import { MetadataEffects } from './metadata.effects';
import { initialMetadataState, MetadataState } from './metadata.reducer';

const buildState = (state: Partial<MetadataState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialMetadataState, ...state })) });

const metadata: Array<IMetadata> = [
  {
    name: 'name1',
    id: '1',
    type: VARIABLE_TYPE.UUID
  }
];

describe('MetadataEffects', () => {
  let actions$: Observable<any>;
  let effects: MetadataEffects;
  let adminService: AdminService;
  const initialState = initialMetadataState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        MetadataEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getMetadataList: () => of(metadata),
            getMetadata: () => of(metadata[0]),
            updateMetadata: () => of(null),
            postMetadata: () => of(null)
          }
        }
      ]
    });

    effects = TestBed.inject(MetadataEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('loadMetadata$', () => {
    it('should set metadata get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getMetadataList');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: MetadataActions.loadMetadata()
      });

      const expected$ = hot('--a-', {
        a: MetadataActions.loadMetadataSuccess({ metadata: metadata })
      });
      expect(effects.loadMetadata$).toBeObservable(expected$);
      expect(effects.loadMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadMetadata failure', () => {
      const getSpy = jest.spyOn(adminService, 'getMetadataList').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: MetadataActions.loadMetadata()
      });

      const expected$ = hot('--a-', {
        a: MetadataActions.loadMetadataFailure({ error: new Error('error') })
      });
      expect(effects.loadMetadata$).toBeObservable(expected$);
      expect(effects.loadMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('createMetadata$', () => {
    it('should call createMetadataSuccess', () => {
      const getSpy = jest.spyOn(adminService, 'postMetadata');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: MetadataActions.createMetadata({ metadata: metadata[0] })
      });

      const expected$ = hot('--a-', {
        a: MetadataActions.createMetadataSuccess({ metadata: metadata[0] })
      });
      expect(effects.createMetadata$).toBeObservable(expected$);
      expect(effects.createMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call createMetadata failure', () => {
      const getSpy = jest.spyOn(adminService, 'postMetadata').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: MetadataActions.createMetadata({ metadata: metadata[0] })
      });

      const expected$ = hot('--a-', {
        a: MetadataActions.createMetadataFailure({ error: new Error('error') })
      });
      expect(effects.createMetadata$).toBeObservable(expected$);
      expect(effects.createMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('routing', () => {
    it('should route to load editView', () => {
      actions$ = hot('--a-', {
        a: MetadataActions.goToNewMetadata({ route: '/admin/metadata/new' })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: '/admin/metadata/new' })
      });
      expect(effects.goToNewMetadata$).toBeObservable(expected$);
    });

    it('should route to load detailsView', () => {
      const getSpy = jest.spyOn(adminService, 'getMetadata');
      store.setState(
        buildState({
          ...initialState,
          metadata: metadata
        })
      );
      actions$ = hot('--a-', {
        a: MetadataActions.goToDetailsView({ id: '1' })
      });

      const expected$ = hot('--a-', {
        a: MetadataActions.goToDetailsViewSuccess({ metadata: metadata[0] })
      });
      expect(effects.goToDetailsView$).toBeObservable(expected$);
      expect(effects.goToDetailsView$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
      expect(effects.goToDetailsView$).toBeObservable(expected$);
    });
  });
});
