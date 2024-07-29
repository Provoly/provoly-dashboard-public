import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CategoryActions, ClassActions, PryDialogService } from '@provoly/dashboard';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { attribute, classes } from '../../../../mock/data/mockItemAdmin';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { AdminClassActions } from './admin-class.actions';
import { AdminClassEffects } from './admin-class.effects';
import { AdminClassState, initialClassState } from './admin-class.reducer';

const buildState = (state: Partial<AdminClassState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialClassState, ...state })) });

describe('ClassesEffects', () => {
  let actions$: Observable<any>;
  let effects: AdminClassEffects;
  let adminService: AdminService;
  let pryDialog: PryDialogService;
  const initialState = initialClassState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminClassEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: PryDialogService,
          useValue: {
            open: () => of('')
          }
        },
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            saveClass: () => of(''),
            saveAttributeForClass: () => of(''),
            deleteClass: () => of(''),
            deleteAttributeForClass: () => of(''),
            saveCategory: () => of('')
          }
        }
      ]
    });

    effects = TestBed.inject(AdminClassEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    pryDialog = TestBed.inject<PryDialogService>(PryDialogService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('saveClass', () => {
    it('should save Class', () => {
      const getSpy = jest.spyOn(adminService, 'saveClass');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.saveClass({ class: classes[0], route: '/' })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.saveClassSuccess({ route: '/' })
      });
      expect(effects.saveClass$).toBeObservable(expected$);
      expect(effects.saveClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call saveClass failure', () => {
      const getSpy = jest.spyOn(adminService, 'saveClass').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.saveClass({ class: classes[0], route: '/classes' })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.saveClassFailure({ error: new Error('error') })
      });
      expect(effects.saveClass$).toBeObservable(expected$);
      expect(effects.saveClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('saveClassSucess$', () => {
    it('should route to load Classes', () => {
      actions$ = hot('--a-', {
        a: AdminClassActions.saveClassSuccess({ route: '/' })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: '/' })
      });
      expect(effects.saveClassSuccess$).toBeObservable(expected$);
    });
  });

  describe('saveInterClass$', () => {
    it('should route to load Classes', () => {
      actions$ = hot('--a-', {
        a: AdminClassActions.saveInterClass({ class: classes[0], route: '/' })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: '/' })
      });
      expect(effects.saveInterClass$).toBeObservable(expected$);
    });
  });

  describe('saveAttributeForClass', () => {
    it('should save Attribute for selected Class', () => {
      const getSpy = jest.spyOn(adminService, 'saveAttributeForClass');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.saveAttributeForClass({ classId: classes[0].id, attribute: attribute, route: '/' })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.saveAttributeForClassSuccess({ route: '/' })
      });
      expect(effects.saveAttributeForClass$).toBeObservable(expected$);
      expect(effects.saveAttributeForClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalledWith('id', attribute);
      });
    });
    it('should call saveAttributeForClass failure', () => {
      const getSpy = jest
        .spyOn(adminService, 'saveAttributeForClass')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.saveAttributeForClass({ classId: classes[0].id, attribute: attribute, route: '/classes' })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.saveAttributeForClassFailure({ error: new Error('error') })
      });
      expect(effects.saveAttributeForClass$).toBeObservable(expected$);
      expect(effects.saveAttributeForClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('saveAttributeForClassSucess$', () => {
    it('should route to load Classes', () => {
      actions$ = hot('--a-', {
        a: AdminClassActions.saveAttributeForClassSuccess({ route: '/' })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: '/' })
      });
      expect(effects.saveAttributeForClassSuccess$).toBeObservable(expected$);
    });
  });

  describe('deleteClass', () => {
    it('should open confirmation dialog', () => {
      const getSpy = jest.spyOn(pryDialog, 'open');
      const action = AdminClassActions.confirmClassDeletion({ id: classes[0].id, path: '/' });
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('a', {
        a: action
      });

      expect(effects.confirmClassDeletion$).toBeObservable(cold('a', { a: action }));

      expect(effects.confirmClassDeletion$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should delete Class', () => {
      const getSpy = jest.spyOn(adminService, 'deleteClass');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.deleteClass({ id: classes[0].id, route: '/' })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.deleteClassSuccess({ route: '/' })
      });
      expect(effects.deleteClass$).toBeObservable(expected$);
      expect(effects.deleteClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call deleteClass failure', () => {
      const getSpy = jest.spyOn(adminService, 'deleteClass').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.deleteClass({ id: classes[0].id, route: '/classes' })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.deleteClassFailure({ error: new Error('error') })
      });
      expect(effects.deleteClass$).toBeObservable(expected$);
      expect(effects.deleteClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('deleteClassSuccess$', () => {
    it('should route to load Classes', () => {
      actions$ = hot('--a-', {
        a: AdminClassActions.deleteClassSuccess({ route: '/' })
      });

      const expected$ = hot('--(ab)-', {
        a: AdminClassActions.updateToolbox(),
        b: AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: '/' }),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'classes',
              actionAccess: 'write'
            }
          ]
        })
      });
      expect(effects.deleteClassSuccess$).toBeObservable(expected$);
    });
  });

  describe('deleteAttributeForClass', () => {
    it('should delete Attribute for selected Class', () => {
      const getSpy = jest.spyOn(adminService, 'deleteAttributeForClass');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.deleteAttributeForClass({
          classId: classes[0].id,
          attrId: attribute.id,
          backPath: '/',
          addAttrPath: 'new'
        })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.deleteAttributeForClassSuccess({
          classId: classes[0].id,
          backPath: '/',
          addAttrPath: 'new'
        })
      });
      expect(effects.deleteAttributeForClass$).toBeObservable(expected$);
      expect(effects.deleteAttributeForClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call deleteAttributeForClass failure', () => {
      const getSpy = jest
        .spyOn(adminService, 'deleteAttributeForClass')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.deleteAttributeForClass({
          classId: classes[0].id,
          attrId: attribute.id,
          backPath: '/',
          addAttrPath: 'new'
        })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.deleteAttributeForClassFailure({ error: new Error('error') })
      });
      expect(effects.deleteAttributeForClass$).toBeObservable(expected$);
      expect(effects.deleteAttributeForClass$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('deleteAttributeForClassSuccess$', () => {
    it('should route to load Attribute and update toolbox action', () => {
      actions$ = hot('--a-', {
        a: AdminClassActions.deleteAttributeForClassSuccess({
          classId: classes[0].id,
          backPath: '/',
          addAttrPath: 'new'
        })
      });

      const expected$ = hot('--(ab)-', {
        a: AdminClassActions.updateToolbox(),
        b: AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: '/' }),
              label: 'back',
              icon: 'arrow_back'
            },
            {
              action: AdminActions.routeTo({ path: 'new' }),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'classes',
              actionAccess: 'write'
            }
          ]
        })
      });
      expect(effects.deleteAttributeForClassSuccess$).toBeObservable(expected$);
    });
  });

  describe('updateToolbox$', () => {
    it('should reset info for updating toolbox', () => {
      actions$ = hot('--a-', {
        a: AdminClassActions.updateToolbox()
      });

      const expected$ = hot('--(ab)-', {
        a: ClassActions.load(),
        b: AdminActions.selectComponentType({ componentType: null })
      });
      expect(effects.updateToolbox$).toBeObservable(expected$);
    });
  });

  describe('saveCategory', () => {
    it('should save Category', () => {
      const getSpy = jest.spyOn(adminService, 'saveCategory');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.saveCategory({ category: classes[0] })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.saveCategorySuccess()
      });
      expect(effects.saveCategory$).toBeObservable(expected$);
      expect(effects.saveCategory$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call saveCategory failure', () => {
      const getSpy = jest.spyOn(adminService, 'saveCategory').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminClassActions.saveCategory({ category: classes[0] })
      });

      const expected$ = hot('--a-', {
        a: AdminClassActions.saveCategoryFailure({ error: new Error('error') })
      });
      expect(effects.saveCategory$).toBeObservable(expected$);
      expect(effects.saveCategory$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('saveCategorySucess$', () => {
    it('should reload Categories', () => {
      actions$ = hot('--a-', {
        a: AdminClassActions.saveCategorySuccess()
      });

      const expected$ = hot('--a-', {
        a: CategoryActions.load()
      });
      expect(effects.saveCategorySuccess$).toBeObservable(expected$);
    });
  });
});
