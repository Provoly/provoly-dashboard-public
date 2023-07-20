import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { AbacRulesActions } from './abac-rules.actions';
import { AbacRulesEffects } from './abac-rules.effects';
import { AbacRule, AbacRulesConditions, NormalizedCondition } from './abac-rules.model';
import { AbacRuleState, initialAbacRuleState } from './abac-rules.reducer';
import { AbacRulesSelectors } from './abac-rules.selectors';
import { AbacRulesService } from './abac-rules.service';

const buildState = (state: Partial<AbacRuleState>) =>
  Object.assign({}, { '@pry/admin/abacRules': JSON.parse(JSON.stringify({ ...initialAbacRuleState, ...state })) });

const abacRule: AbacRule = {
  active: true,
  description: 'desc',
  id: 'id',
  name: 'name',
  predicate: 'uuid',
  type: 'ATTRIBUTE'
};
describe('AbacRulesEffects', () => {
  let actions$: Observable<any>;
  let effects: AbacRulesEffects;
  let adminService: AdminService;
  let abacRulesService: AbacRulesService;
  const initialState = initialAbacRuleState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AbacRulesEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: { ...initialState },
          selectors: [
            {
              selector: AbacRulesSelectors.editAbacRule,
              value: abacRule
            },
            {
              selector: AbacRulesSelectors.editAbacRuleConditions,
              value: {} as AbacRulesConditions
            }
          ]
        }),
        {
          provide: AdminService,
          useValue: {
            getAbacRules: () => of([abacRule]),
            getAbacRule: () => of(abacRule),
            saveAbacRule: () => of(null)
          }
        },
        {
          provide: AbacRulesService,
          useValue: {
            initializeCondition: () => ({ id: 'id' }) as NormalizedCondition,
            getMetadataCondition: () => ({ id: 'id' }) as NormalizedCondition,
            getAttributeCondition: () => ({ id: 'id' }) as NormalizedCondition,
            buildPayloadForAbacRule: () => abacRule,
            mapAbacRuleToEditAbacRule: () => ({
              rule: abacRule,
              conditions: {
                masterId: 'id',
                ids: ['id'],
                entities: { id: { id: 'id' } as NormalizedCondition }
              }
            })
          }
        }
      ]
    });
    effects = TestBed.inject(AbacRulesEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    abacRulesService = TestBed.inject<AbacRulesService>(AbacRulesService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
  describe('loadAbacRules$', () => {
    it('should set abac rules get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getAbacRules');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.loadAbacRules()
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.loadAbacRulesSuccess({ datas: [abacRule] })
      });
      expect(effects.loadAbacRules$).toBeObservable(expected$);
      expect(effects.loadAbacRules$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call load abac rules failure', () => {
      const getSpy = jest.spyOn(adminService, 'getAbacRules').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.loadAbacRules()
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.loadAbacRulesFailure({ error: new Error('error') })
      });
      expect(effects.loadAbacRules$).toBeObservable(expected$);
      expect(effects.loadAbacRules$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('cancelAbacRuleEdition$', () => {
    it('should call admin route to', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.cancelAbacRuleEdition({ redirect: 'path' })
      });

      const expected$ = hot('--a-', {
        a: AdminActions.routeTo({ path: 'path' })
      });
      expect(effects.cancelAbacRuleEdition$).toBeObservable(expected$);
    });
  });
  describe('initEditAbacRule$', () => {
    it('should call abac rule action and abac rule conditions action', () => {
      const getSpy = jest.spyOn(abacRulesService, 'initializeCondition');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.initEditAbacRule({ rule: abacRule })
      });

      const expected$ = hot('--(ab)-', {
        a: AbacRulesActions.updateEditAbacRule({ rule: abacRule }),
        b: AbacRulesActions.initEditAbacRuleConditions({
          condition: {
            masterId: 'id',
            ids: ['id'],
            entities: { id: { id: 'id' } as NormalizedCondition }
          }
        })
      });
      expect(effects.initEditAbacRule$).toBeObservable(expected$);
      expect(effects.initEditAbacRule$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('createEditAbacRuleMetadataCondition$', () => {
    it('should get metadata condition', () => {
      const getSpy = jest.spyOn(abacRulesService, 'getMetadataCondition');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.createEditAbacRuleMetadataCondition({ parentId: 'id', metadataId: 'metadata' })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.addEditAbacRuleConditions({ condition: { id: 'id' } as NormalizedCondition })
      });
      expect(effects.createEditAbacRuleMetadataCondition$).toBeObservable(expected$);
      expect(effects.createEditAbacRuleMetadataCondition$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('createEditAbacRuleAttributeCondition$', () => {
    it('should call attribute condition', () => {
      const getSpy = jest.spyOn(abacRulesService, 'getAttributeCondition');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.createEditAbacRuleAttributeCondition({
          parentId: 'id',
          attributeId: 'attribute',
          classId: 'classId'
        })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.addEditAbacRuleConditions({ condition: { id: 'id' } as NormalizedCondition })
      });
      expect(effects.createEditAbacRuleAttributeCondition$).toBeObservable(expected$);
      expect(effects.createEditAbacRuleAttributeCondition$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('createEditAbacRuleNestedCondition$', () => {
    it('should call initialize condition', () => {
      const getSpy = jest.spyOn(abacRulesService, 'initializeCondition');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.createEditAbacRuleNestedCondition({
          parentId: 'id'
        })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.addEditAbacRuleConditions({ condition: { id: 'id' } as NormalizedCondition })
      });
      expect(effects.createEditAbacRuleNestedCondition$).toBeObservable(expected$);
      expect(effects.createEditAbacRuleNestedCondition$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('addEditAbacRuleConditionsMetadata$', () => {
    it('should add edit condition to parent', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.addEditAbacRuleConditions({
          condition: { id: 'id', parentId: 'parentId' } as NormalizedCondition
        })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.addEditAbacRuleConditionsToParent({ conditionId: 'id', parentId: 'parentId' })
      });
      expect(effects.addEditAbacRuleConditionsMetadata$).toBeObservable(expected$);
    });
  });
  describe('removeEditAbacRuleConditionFromComposed$', () => {
    it('should remove edit condition', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.removeEditAbacRuleConditionFromComposed({
          childrenId: 'id',
          conditionId: 'id2'
        })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.removeEditAbacRuleLeafCondition({ conditionId: 'id' })
      });
      expect(effects.removeEditAbacRuleConditionFromComposed$).toBeObservable(expected$);
    });
  });

  describe('saveEditAbacRule$', () => {
    it('should success', () => {
      const getSpy = jest.spyOn(adminService, 'saveAbacRule');
      const getSpyBis = jest.spyOn(abacRulesService, 'buildPayloadForAbacRule');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.saveEditAbacRule({ redirect: 'path' })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.saveAbacRuleSuccess({ redirect: 'path' })
      });
      expect(effects.saveEditAbacRule$).toBeObservable(expected$);
      expect(effects.saveEditAbacRule$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
        expect(getSpyBis).toHaveBeenCalled();
      });
    });
    it('should failure', () => {
      const getSpy = jest.spyOn(adminService, 'saveAbacRule').mockReturnValue(throwError(() => new Error('error')));
      const getSpyBis = jest.spyOn(abacRulesService, 'buildPayloadForAbacRule');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.saveEditAbacRule({ redirect: 'path' })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.saveAbacRuleFailure({ error: new Error('error') })
      });
      expect(effects.saveEditAbacRule$).toBeObservable(expected$);
      expect(effects.saveEditAbacRule$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
        expect(getSpyBis).toHaveBeenCalled();
      });
    });
  });

  describe('saveAbacRuleSuccess$', () => {
    it('should call reset abac rule and route to', () => {
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.saveAbacRuleSuccess({
          redirect: 'path'
        })
      });

      const expected$ = hot('--(ab)-', {
        a: AbacRulesActions.resetEditAbacRule(),
        b: AdminActions.routeTo({ path: 'path' })
      });
      expect(effects.saveAbacRuleSuccess$).toBeObservable(expected$);
    });
  });
  describe('fetchAbacRule$', () => {
    it('should set abac rules get by the http GET', () => {
      const getSpy = jest.spyOn(adminService, 'getAbacRule');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.fetchAbacRule({ id: 'id' })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.fetchAbacRuleSuccess({ rule: abacRule })
      });
      expect(effects.fetchAbacRule$).toBeObservable(expected$);
      expect(effects.fetchAbacRule$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
    it('should call fetch abac rule failure', () => {
      const getSpy = jest.spyOn(adminService, 'getAbacRule').mockReturnValue(throwError(() => new Error('error')));
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.fetchAbacRule({ id: 'id' })
      });

      const expected$ = hot('--a-', {
        a: AbacRulesActions.fetchAbacRuleFailure({ error: new Error('error') })
      });
      expect(effects.fetchAbacRule$).toBeObservable(expected$);
      expect(effects.fetchAbacRule$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
  describe('fetchAbacRuleSuccess$', () => {
    it('should call abac rule action and abac rule conditions action', () => {
      const getSpy = jest.spyOn(abacRulesService, 'mapAbacRuleToEditAbacRule');
      store.setState(
        buildState({
          ...initialState
        })
      );

      actions$ = hot('--a-', {
        a: AbacRulesActions.fetchAbacRuleSuccess({ rule: abacRule })
      });

      const expected$ = hot('--(ab)-', {
        a: AbacRulesActions.updateEditAbacRule({ rule: abacRule }),
        b: AbacRulesActions.initEditAbacRuleConditions({
          condition: {
            masterId: 'id',
            ids: ['id'],
            entities: { id: { id: 'id' } as NormalizedCondition }
          }
        })
      });
      expect(effects.fetchAbacRuleSuccess$).toBeObservable(expected$);
      expect(effects.fetchAbacRuleSuccess$).toSatisfyOnFlush(() => {
        expect(getSpy).toHaveBeenCalled();
      });
    });
  });
});
