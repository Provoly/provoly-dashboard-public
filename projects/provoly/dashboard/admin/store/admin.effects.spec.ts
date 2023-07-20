import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Predicate, RelationTypesActions } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of } from 'rxjs';
import { AdminActions } from './admin.actions';
import { AdminEffects } from './admin.effects';
import { AdminState, initialAdminState } from './admin.reducer';
import { AdminService } from './admin.service';

const buildState = (state: Partial<AdminState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialAdminState, ...state })) });

const predicates: Predicate[] = [
  {
    name: 'predicate',
    id: '1',
    value: 'value'
  }
];

describe('AdminEffects', () => {
  let actions$: Observable<any>;
  let effects: AdminEffects;
  let adminService: AdminService;
  const initialState = initialAdminState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'path', redirectTo: '' }])],
      providers: [
        AdminEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getPredicates: () => of(predicates),
            getNextAvailableNum: () => of(2),
            getPredicate: () => of(predicates[0]),
            savePredicate: () => of('')
          }
        }
      ]
    });

    effects = TestBed.inject(AdminEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
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
        a: AdminActions.routeTo({ path: 'path' })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.resetActions()
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
        a: AdminActions.routeTo({ path: 'path', params: { toto: 'toto' } })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.resetActions()
      });
      expect(effects.routeTo$).toBeObservable(expected$);
      expect(effects.routeTo$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
        expect(getSpy.mock.calls[0]).toEqual([['path'], { queryParams: { toto: 'toto' } }]);
      });
    });
    it('should call navigate without reset if route is already there', () => {
      const getSpy = jest.spyOn(router, 'navigate');
      store.setState(
        buildState({
          ...initialState
        })
      );
      jest.spyOn(router, 'url', 'get').mockReturnValue('path');

      actions$ = hot('--a-', {
        a: AdminActions.routeTo({ path: 'path', params: { toto: 'toto' } })
      });

      const expected$ = hot('---');
      expect(effects.routeTo$).toBeObservable(expected$);
      expect(effects.routeTo$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
        expect(getSpy.mock.calls[0]).toEqual([['path'], { queryParams: { toto: 'toto' } }]);
      });
    });
  });

  describe('deleteLinkSuccess$', () => {
    it('should call load link , set component type and update toolbox', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: RelationTypesActions.deleteRelationTypeSuccess()
      });

      const expected$ = hot('--(abc)-', {
        a: RelationTypesActions.load(),
        b: AdminActions.selectComponentType({ componentType: null }),
        c: AdminActions.mainActions({
          actions: [
            {
              action: RelationTypesActions.openModal(),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'relation_types',
              actionAccess: 'write'
            }
          ]
        })
      });

      expect(effects.deleteRelationTypeSuccess$).toBeObservable(expected$);
    });
  });
});
