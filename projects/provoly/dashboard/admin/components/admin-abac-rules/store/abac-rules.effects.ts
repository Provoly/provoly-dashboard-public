import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { AbacRulesActions } from './abac-rules.actions';
import { AbacRulesSelectors } from './abac-rules.selectors';
import { AbacRulesService } from './abac-rules.service';

@Injectable()
export class AbacRulesEffects {
  loadAbacRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.loadAbacRules),
      mergeMap((action) =>
        this.service.getAbacRules().pipe(
          map((datas) => AbacRulesActions.loadAbacRulesSuccess({ datas })),
          catchError((error) => [AbacRulesActions.loadAbacRulesFailure({ error: error })])
        )
      )
    )
  );

  cancelAbacRuleEdition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.cancelAbacRuleEdition),
      map((action) => AdminActions.routeTo({ path: action.redirect }))
    )
  );

  initEditAbacRule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.initEditAbacRule),
      switchMap((action) => {
        const abacRuleAction$ = AbacRulesActions.updateEditAbacRule({ rule: action.rule });
        const initialEditAbacConditions = this.abacRulesService.initializeCondition();
        const abacRuleConditionsAction$ = AbacRulesActions.initEditAbacRuleConditions({
          condition: {
            masterId: initialEditAbacConditions.id,
            ids: [initialEditAbacConditions.id],
            entities: {
              [initialEditAbacConditions.id]: initialEditAbacConditions
            }
          }
        });
        return [abacRuleAction$, abacRuleConditionsAction$];
      })
    )
  );

  createEditAbacRuleMetadataCondition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.createEditAbacRuleMetadataCondition),
      map((action) => {
        const newMetadataCondition = this.abacRulesService.getMetadataCondition(action.metadataId, action.parentId);
        return AbacRulesActions.addEditAbacRuleConditions({ condition: newMetadataCondition });
      })
    )
  );

  createEditAbacRuleAttributeCondition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.createEditAbacRuleAttributeCondition),
      map((action) => {
        const newAttributeCondition = this.abacRulesService.getAttributeCondition(
          action.attributeId,
          action.classId,
          action.parentId
        );
        return AbacRulesActions.addEditAbacRuleConditions({ condition: newAttributeCondition });
      })
    )
  );

  createEditAbacRuleNestedCondition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.createEditAbacRuleNestedCondition),
      map((action) => {
        const newCondition = this.abacRulesService.initializeCondition(action.parentId);
        return AbacRulesActions.addEditAbacRuleConditions({ condition: newCondition });
      })
    )
  );

  addEditAbacRuleConditionsMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.addEditAbacRuleConditions),
      map((action) => {
        return AbacRulesActions.addEditAbacRuleConditionsToParent({
          conditionId: action.condition.id,
          parentId: action.condition.parentId
        });
      })
    )
  );

  removeEditAbacRuleConditionFromComposed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.removeEditAbacRuleConditionFromComposed),
      map((action) => {
        return AbacRulesActions.removeEditAbacRuleLeafCondition({
          conditionId: action.childrenId
        });
      })
    )
  );

  saveEditAbacRule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.saveEditAbacRule),
      withLatestFrom(
        this.store.select(AbacRulesSelectors.editAbacRule),
        this.store.select(AbacRulesSelectors.editAbacRuleConditions)
      ),
      mergeMap(([action, rule, conditions]) => {
        const payload = this.abacRulesService.buildPayloadForAbacRule(rule!, conditions);
        return this.service.saveAbacRule(payload).pipe(
          map(() => AbacRulesActions.saveAbacRuleSuccess({ redirect: action.redirect })),
          catchError((error) => [AbacRulesActions.saveAbacRuleFailure({ error: error })])
        );
      })
    )
  );

  saveAbacRuleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.saveAbacRuleSuccess),
      mergeMap((action) => [AbacRulesActions.resetEditAbacRule(), AdminActions.routeTo({ path: action.redirect })])
    )
  );

  fetchAbacRule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.fetchAbacRule),
      mergeMap((action) =>
        this.service.getAbacRule(action.id).pipe(
          map((rule) => AbacRulesActions.fetchAbacRuleSuccess({ rule })),
          catchError((error) => [AbacRulesActions.fetchAbacRuleFailure({ error: error })])
        )
      )
    )
  );

  fetchAbacRuleSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AbacRulesActions.fetchAbacRuleSuccess),
      switchMap((action) => {
        const editRule = this.abacRulesService.mapAbacRuleToEditAbacRule(action.rule);
        const abacRuleAction$ = AbacRulesActions.updateEditAbacRule({ rule: editRule.rule });
        const abacRuleConditionsAction$ = AbacRulesActions.initEditAbacRuleConditions({
          condition: editRule.conditions
        });
        return [abacRuleAction$, abacRuleConditionsAction$];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private store: Store<any>,
    private abacRulesService: AbacRulesService
  ) {}
}
