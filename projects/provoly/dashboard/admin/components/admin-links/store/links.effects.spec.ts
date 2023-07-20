import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { links, linksDetails } from '../../../../mock/data/mockItemAdmin';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { LinksActions } from './links.actions';
import { LinksEffects } from './links.effects';
import { initialLinkState, LinkState } from './links.reducer';

const buildState = (state: Partial<LinkState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialLinkState, ...state })) });

describe('LinksEffects', () => {
  let actions$: Observable<any>;
  let effects: LinksEffects;
  let adminService: AdminService;
  const initialState = initialLinkState;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        LinksEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getLinks: () => of(linksDetails),
            saveLink: () => of('')
          }
        }
      ]
    });

    effects = TestBed.inject(LinksEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('loadLinks$', () => {
    it('should set Links get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getLinks');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: LinksActions.loadLinks()
      });

      const expected$ = hot('--a-', {
        a: LinksActions.loadLinksSuccess({ datas: linksDetails })
      });
      expect(effects.loadLinks$).toBeObservable(expected$);
      expect(effects.loadLinks$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadUser failure', () => {
      const getSpy = jest.spyOn(adminService, 'getLinks').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: LinksActions.loadLinks()
      });

      const expected$ = hot('--a-', {
        a: LinksActions.loadLinksFailure({ error: new Error('error') })
      });
      expect(effects.loadLinks$).toBeObservable(expected$);
      expect(effects.loadLinks$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('saveLinks$', () => {
    it('should set Links get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'saveLink');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: LinksActions.saveLink({ link: links[0], route: '/' })
      });

      const expected$ = hot('--a-', {
        a: LinksActions.saveLinkSuccess({ route: '/' })
      });
      expect(effects.saveLink$).toBeObservable(expected$);
      expect(effects.saveLink$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call loadUser failure', () => {
      const getSpy = jest.spyOn(adminService, 'saveLink').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: LinksActions.saveLink({ link: links[0], route: '/' })
      });

      const expected$ = hot('--a-', {
        a: LinksActions.saveLinkFailure({ error: new Error('error') })
      });
      expect(effects.saveLink$).toBeObservable(expected$);
      expect(effects.saveLink$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('saveLinksSuccess$', () => {
    it('should set Links get by the http GET', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: LinksActions.saveLinkSuccess({ route: '/' })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: '/' })
      });
      expect(effects.saveLinkSuccess$).toBeObservable(expected$);
    });
  });
});
