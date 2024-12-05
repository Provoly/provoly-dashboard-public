import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FieldActions, FieldService, PryDialogService } from '@provoly/dashboard';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { field } from '../../../../mock/data/mockItemAdmin';
import { AdminActions } from '../../../store/admin.actions';
import { FieldsActions } from './fields.actions';
import { FieldsEffects } from './fields.effects';

describe('FieldsEffects', () => {
  let actions$: Observable<any>;
  let effects: FieldsEffects;
  let fieldService: FieldService;
  let store: MockStore<any>;
  let router: Router;
  let pryDialog: PryDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FieldsEffects,
        provideMockStore({}),
        provideMockActions(() => actions$),
        {
          provide: PryDialogService,
          useValue: {
            open: () => of('')
          }
        },
        {
          provide: FieldService,
          useValue: {
            saveField: () => of(''),
            deleteField: () => of('')
          }
        }
      ]
    });

    effects = TestBed.inject(FieldsEffects);
    fieldService = TestBed.inject<FieldService>(FieldService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    pryDialog = TestBed.inject<PryDialogService>(PryDialogService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('saveField', () => {
    it('should save Field', () => {
      const getSpy = jest.spyOn(fieldService, 'saveField');

      actions$ = hot('--a-', {
        a: FieldsActions.saveField({ field: field, route: '/' })
      });

      const expected$ = hot('--a-', {
        a: FieldsActions.saveFieldSuccess({ route: '/' })
      });
      expect(effects.saveField$).toBeObservable(expected$);
      expect(effects.saveField$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call saveField failure', () => {
      const getSpy = jest.spyOn(fieldService, 'saveField').mockReturnValue(throwError(() => new Error('error')));

      actions$ = hot('--a-', {
        a: FieldsActions.saveField({ field: field, route: '/' })
      });

      const expected$ = hot('--a-', {
        a: FieldsActions.failure({ error: new Error('error') })
      });
      expect(effects.saveField$).toBeObservable(expected$);
      expect(effects.saveField$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('saveClassSucess$', () => {
    it('should route to load Classes', () => {
      actions$ = hot('--a-', {
        a: FieldsActions.saveFieldSuccess({ route: '/' })
      });

      const expected$ = hot('--(a)-', {
        a: AdminActions.routeTo({ path: '/' })
      });
      expect(effects.saveFieldSuccess$).toBeObservable(expected$);
    });
  });

  describe('delete Field', () => {
    it('should open confirmation dialog', () => {
      const getSpy = jest.spyOn(pryDialog, 'open');
      const action = FieldsActions.confirmFieldDeletion({ id: '', path: '' });

      actions$ = hot('a', {
        a: action
      });

      expect(effects.confirmFieldDeletion$).toBeObservable(cold('a', { a: action }));

      expect(effects.confirmFieldDeletion$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });

    it('should make the DELETE request', () => {
      const getSpy = jest.spyOn(fieldService, 'deleteField');
      actions$ = hot('a', {
        a: FieldsActions.deleteField({ id: '1', route: '/' })
      });
      const expected$ = hot('a', {
        a: FieldsActions.deleteFieldSuccess()
      });

      expect(effects.deleteField$).toBeObservable(expected$);
      expect(effects.deleteField$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });

    it('should reload fields upon deletion', () => {
      actions$ = hot('a', {
        a: FieldsActions.deleteFieldSuccess()
      });

      const expected$ = hot('a', {
        a: FieldActions.load({ force: true })
      });

      expect(effects.deleteFieldSuccess$).toBeObservable(expected$);
    });
  });

  describe('updateToolbox$', () => {
    it('should reset info for updating toolbox', () => {
      actions$ = hot('--a-', {
        a: FieldsActions.updateToolbox()
      });

      const expected$ = hot('--(ab)-', {
        a: FieldActions.load({ force: true }),
        b: AdminActions.selectComponentType({ componentType: null })
      });
      expect(effects.updateToolbox$).toBeObservable(expected$);
    });
  });
});
