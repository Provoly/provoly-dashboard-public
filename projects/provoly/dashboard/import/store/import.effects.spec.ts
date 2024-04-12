import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PrySnackbarService } from '@provoly/dashboard';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { ImportActions } from './import.actions';
import { ImportEffects } from './import.effects';
import { ImportState, initialImportState } from './import.reducer';
import { ImportService } from './import.service';
import { mockImportData } from '@provoly/dashboard/mock/data/import';

const buildState = (state: Partial<ImportState>) =>
  Object.assign({}, { '@pry/import': JSON.parse(JSON.stringify({ ...initialImportState, ...state })) });

describe('ImportEffects', () => {
  let actions$: Observable<any>;
  let effects: ImportEffects;
  let importService: ImportService;
  let store: MockStore<any>;
  let snackbar: PrySnackbarService;
  const initialState = initialImportState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ImportEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: ImportService,
          useValue: {
            upload: (file: File, dataset: string) => of({})
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

    effects = TestBed.inject(ImportEffects);
    importService = TestBed.inject<ImportService>(ImportService);
    snackbar = TestBed.inject<PrySnackbarService>(PrySnackbarService);
    store = TestBed.inject(MockStore);
  });
  describe('upload$', () => {
    it('should call upload success', () => {
      const getSpy = jest.spyOn(importService, 'upload');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: ImportActions.upload({ ...mockImportData })
      });

      const expected$ = hot('--a-', {
        a: ImportActions.uploadSuccess({ uploadedDataset: {} })
      });
      expect(effects.upload$).toBeObservable(expected$);
      expect(effects.upload$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call upload failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: { resume: null, itemErrors: [] },
        status: 400,
        statusText: 'Bad Request'
      });
      const getSpy = jest.spyOn(importService, 'upload').mockReturnValue(throwError(() => errorResponse));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: ImportActions.upload({ ...mockImportData })
      });

      const expected$ = hot('--a-', {
        a: ImportActions.uploadFailure({ errors: errorResponse.error.itemErrors })
      });
      expect(effects.upload$).toBeObservable(expected$);
      expect(effects.upload$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call upload success for .shp file type', () => {
      const getSpy = jest.spyOn(importService, 'upload');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: ImportActions.upload({ ...mockImportData })
      });

      const expected$ = hot('--a-', {
        a: ImportActions.uploadSuccess({ uploadedDataset: {} })
      });
      expect(effects.upload$).toBeObservable(expected$);
      expect(effects.upload$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });

    it('should call upload failure for .shp file type', () => {
      const errorResponse = new HttpErrorResponse({
        error: { resume: null, itemErrors: [] },
        status: 400,
        statusText: 'Bad Request'
      });
      const getSpy = jest.spyOn(importService, 'upload').mockReturnValue(throwError(() => errorResponse));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: ImportActions.upload({ ...mockImportData })
      });

      const expected$ = hot('--a-', {
        a: ImportActions.uploadFailure({ errors: errorResponse.error.itemErrors })
      });
      expect(effects.upload$).toBeObservable(expected$);
      expect(effects.upload$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
