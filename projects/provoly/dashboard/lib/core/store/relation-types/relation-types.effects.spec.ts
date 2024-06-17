import { Overlay } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { relationTypes } from '../../../../mock/data/mockItemAdmin';
import { PryDialogService } from '../../components/overlay/dialog.service';
import { RelationTypesActions } from './relation-types.actions';
import { RelationTypesEffects } from './relation-types.effects';
import { initialRelationTypeState, RelationTypeState } from './relation-types.reducer';
import { RelationTypesService } from './relation-types.service';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

const buildState = (state: Partial<RelationTypeState>) =>
  Object.assign({}, { '@pry/admin': JSON.parse(JSON.stringify({ ...initialRelationTypeState, ...state })) });

describe('LinksEffects', () => {
  let actions$: Observable<any>;
  let effects: RelationTypesEffects;
  let relationService: RelationTypesService;
  let pryDialog: PryDialogService;
  const initialState = initialRelationTypeState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        RelationTypesEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: PryDialogService,
          useValue: {
            open: () => of('')
          }
        },
        {
          provide: RelationTypesService,
          useValue: {
            getRelationsTypes: () => of(relationTypes),
            addRelationType: () => of(''),
            deleteRelationType: () => of('')
          }
        },
        { provide: Overlay, useValue: MockOverlay }
      ]
    });

    effects = TestBed.inject(RelationTypesEffects);
    relationService = TestBed.inject<RelationTypesService>(RelationTypesService);
    pryDialog = TestBed.inject<PryDialogService>(PryDialogService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('saveLink$', () => {
    it('should save Link get by the http POST', () => {
      const getSpy = jest.spyOn(relationService, 'addRelationType');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: RelationTypesActions.saveRelationType({ id: relationTypes[0].id, name: relationTypes[0].name })
      });

      const expected$ = hot('--a-', {
        a: RelationTypesActions.saveRelationTypeSuccess()
      });
      expect(effects.saveRelationType$).toBeObservable(expected$);
      expect(effects.saveRelationType$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call saveLink failure', () => {
      const getSpy = jest
        .spyOn(relationService, 'addRelationType')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: RelationTypesActions.saveRelationType({ id: relationTypes[0].id, name: relationTypes[0].name })
      });

      const expected$ = hot('--a-', {
        a: RelationTypesActions.saveRelationTypeFailure({ error: new Error('error') })
      });
      expect(effects.saveRelationType$).toBeObservable(expected$);
      expect(effects.saveRelationType$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });

  describe('saveLinkSuccess$', () => {
    it('should call load link effect', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: RelationTypesActions.saveRelationTypeSuccess()
      });

      const expected$ = hot('--a-', {
        a: RelationTypesActions.load()
      });
      expect(effects.saveRelationTypeSuccess$).toBeObservable(expected$);
    });
  });

  describe('deleteRelationType$', () => {
    it('should delete Link get by the http DELETE', () => {
      const getSpy = jest.spyOn(relationService, 'deleteRelationType');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: RelationTypesActions.deleteRelationType({ relationType: relationTypes[0] })
      });

      const expected$ = hot('--a-', {
        a: RelationTypesActions.deleteRelationTypeSuccess()
      });
      expect(effects.deleteRelationType$).toBeObservable(expected$);
      expect(effects.deleteRelationType$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call deleteRelationType failure', () => {
      const getSpy = jest
        .spyOn(relationService, 'deleteRelationType')
        .mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: RelationTypesActions.deleteRelationType({ relationType: relationTypes[0] })
      });

      const expected$ = hot('--a-', {
        a: RelationTypesActions.deleteRelationTypeFailure({ error: new Error('error') })
      });
      expect(effects.deleteRelationType$).toBeObservable(expected$);
      expect(effects.deleteRelationType$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
