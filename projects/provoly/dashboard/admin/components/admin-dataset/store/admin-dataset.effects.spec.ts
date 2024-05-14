import { hot } from 'jest-marbles';
import { MetadataActions, MetadataService } from '@provoly/dashboard/components/metadata-editor';
import { Observable, of, throwError } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { metadata, metadataUser } from '@provoly/dashboard/mock/data/mockItemAdmin';
import { initialDatasetState } from './admin-dataset.reducer';
import { AdminDatasetEffects } from './admin-dataset.effects';
import { AdminDatasetService } from './admin-dataset.service';

describe('AdminDatasetEffects', () => {
  let actions$: Observable<any>;
  let effects: AdminDatasetEffects;
  let metadataService: MetadataService;
  let datasetService: AdminDatasetService;
  const initialState = initialDatasetState;
  let store: MockStore<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminDatasetEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: MetadataService,
          useValue: {
            getMetadataList: () => of(metadata),
            getMetadata: () => of(metadata[0]),
            postMetadata: () => of(null),
            addMetadataUser: () => of(null),
            deleteMetadataUser: () => of(null),
            getUserMetadata: () => of(metadata),
            getMetadataUser: () => of(metadataUser)
          }
        },
        {
          provide: AdminDatasetService,
          useValue: {
            addDatasetMetadata: () => of(undefined),
            deleteDatasetMetadata: () => of(undefined)
          }
        }
      ]
    });

    effects = TestBed.inject(AdminDatasetEffects);
    metadataService = TestBed.inject<MetadataService>(MetadataService);
    datasetService = TestBed.inject<AdminDatasetService>(AdminDatasetService);
    store = TestBed.inject(MockStore);
  });

  describe('addDatasetMetadata$', () => {
    it('should call addDatasetMetadataSuccess on successful PUT', () => {
      const getSpy = jest.spyOn(datasetService, 'addDatasetMetadata');
      store.setState(initialState);

      actions$ = hot('a', {
        a: MetadataActions.addDatasetMetadata({ datasetId: 'id', metadataId: 'id2', value: 'meta-value' })
      });

      const expected$ = hot('a', {
        a: MetadataActions.addDatasetMetadataSuccess({ datasetId: 'id' })
      });
      expect(effects.addDatasetMetadata$).toBeObservable(expected$);
      expect(effects.addDatasetMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call addDatasetMetadataFailure on failed PUT', () => {
      const getSpy = jest
        .spyOn(datasetService, 'addDatasetMetadata')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(initialState);

      actions$ = hot('--a-', {
        a: MetadataActions.addDatasetMetadata({ datasetId: 'id', metadataId: 'id2', value: 'meta-value' })
      });

      const expected$ = hot('--a-', {
        a: MetadataActions.addDatasetMetadataFailure({ error: new Error('error') })
      });
      expect(effects.addDatasetMetadata$).toBeObservable(expected$);
      expect(effects.addDatasetMetadata$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });

    describe('deleteDatasetMetadata$', () => {
      it('should call deleteDatasetMetadataSuccess on successful DELETE', () => {
        const getSpy = jest.spyOn(datasetService, 'deleteDatasetMetadata');
        store.setState(initialState);

        actions$ = hot('a', {
          a: MetadataActions.deleteDatasetMetadata({ datasetId: 'id', metadataId: 'id2' })
        });

        const expected$ = hot('a', {
          a: MetadataActions.deleteDatasetMetadataSuccess({ datasetId: 'id' })
        });
        expect(effects.deleteDatasetMetadata$).toBeObservable(expected$);
        expect(effects.deleteDatasetMetadata$).toSatisfyOnFlush(() => {
          expect(getSpy).toHaveBeenCalled();
        });
      });
      it('should call deleteDatasetMetadataSuccessFailure on failed DELETE', () => {
        const getSpy = jest
          .spyOn(datasetService, 'deleteDatasetMetadata')
          .mockReturnValue(throwError(() => new Error('error')));
        store.setState(initialState);

        actions$ = hot('--a-', {
          a: MetadataActions.deleteDatasetMetadata({ datasetId: 'id', metadataId: 'id2' })
        });

        const expected$ = hot('--a-', {
          a: MetadataActions.deleteDatasetMetadataFailure({ error: new Error('error') })
        });
        expect(effects.deleteDatasetMetadata$).toBeObservable(expected$);
        expect(effects.deleteDatasetMetadata$).toSatisfyOnFlush(() => {
          expect(getSpy).toHaveBeenCalled();
        });
      });
    });
  });
});
