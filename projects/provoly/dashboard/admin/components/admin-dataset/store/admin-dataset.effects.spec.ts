import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DataSourceService } from '@provoly/dashboard';
import { datasetMetadata } from '@provoly/dashboard/mock/data/mockItemAdmin';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AdminDatasetActions } from './admin-dataset.actions';
import { AdminDatasetEffects } from './admin-dataset.effects';
import { AdminDatasetState, initialAdminDatasetState } from './admin-dataset.reducer';

const buildState = (state: Partial<AdminDatasetState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialAdminDatasetState, ...state })) });

describe('Dataset Metadata Effects', () => {
  let actions$: Observable<any>;
  let effects: AdminDatasetEffects;
  let service: DataSourceService;
  const initialState = initialAdminDatasetState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminDatasetEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: DataSourceService,
          useValue: {
            getDatasetMetadata: () => of(datasetMetadata),
            addDatasetMetadata: () => of(null),
            deleteDatasetMetadata: () => of(null)
          }
        }
      ]
    });

    effects = TestBed.inject(AdminDatasetEffects);
    service = TestBed.inject<DataSourceService>(DataSourceService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('addDatasetMetadata$', () => {
    it('should call addDatasetMetadataSuccess on successful PUT', () => {
      const getSpy = jest.spyOn(service, 'addDatasetMetadata');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('a', {
        a: AdminDatasetActions.addDatasetMetadata({ datasetId: 'id', metadataId: 'id2', value: 'meta-value' })
      });

      const expected$ = hot('a', {
        a: AdminDatasetActions.addDatasetMetadataSuccess({ datasetId: 'id' })
      });
      expect(effects.addDatasetMetadata$).toBeObservable(expected$);
      expect(effects.addDatasetMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call addDatasetMetadataFailure on failed PUT', () => {
      const getSpy = jest.spyOn(service, 'addDatasetMetadata').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminDatasetActions.addDatasetMetadata({ datasetId: 'id', metadataId: 'id2', value: 'meta-value' })
      });

      const expected$ = hot('--a-', {
        a: AdminDatasetActions.addDatasetMetadataFailure({ error: new Error('error') })
      });
      expect(effects.addDatasetMetadata$).toBeObservable(expected$);
      expect(effects.addDatasetMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('deleteDatasetMetadata$', () => {
    it('should call deleteDatasetMetadataSuccess on successful DELETE', () => {
      const getSpy = jest.spyOn(service, 'deleteDatasetMetadata');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('a', {
        a: AdminDatasetActions.deleteDatasetMetadata({ datasetId: 'id', metadataId: 'id2' })
      });

      const expected$ = hot('a', {
        a: AdminDatasetActions.deleteDatasetMetadataSuccess({ datasetId: 'id' })
      });
      expect(effects.deleteDatasetMetadata$).toBeObservable(expected$);
      expect(effects.deleteDatasetMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call deleteDatasetMetadataSuccessFailure on failed DELETE', () => {
      const getSpy = jest.spyOn(service, 'deleteDatasetMetadata').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AdminDatasetActions.deleteDatasetMetadata({ datasetId: 'id', metadataId: 'id2' })
      });

      const expected$ = hot('--a-', {
        a: AdminDatasetActions.deleteDatasetMetadataFailure({ error: new Error('error') })
      });
      expect(effects.deleteDatasetMetadata$).toBeObservable(expected$);
      expect(effects.deleteDatasetMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
