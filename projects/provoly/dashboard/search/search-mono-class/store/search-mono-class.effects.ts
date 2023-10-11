import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import {
  ClassSelectors,
  DataSourceActions,
  DataSourceSelectors,
  DatasourceUtils,
  DEFAULT_NAMED_QUERY_ID,
  FieldSelectors,
  FieldType,
  MonoClassSearchPayload,
  MultiClassSearchPayload,
  NamedQueryTypes,
  NormalizedCondition,
  OrderValue,
  SearchActions,
  SearchService
} from '@provoly/dashboard';
import { combineLatest, of } from 'rxjs';
import { catchError, first, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { SearchMultiClassActions } from '../../../search/search-multi-class/store/search-multi-class.actions';
import { SearchMonoClassActions } from './search-mono-class.actions';
import { SearchMonoClassSelectors } from './search-mono-class.selectors';
import { SearchMonoClassService } from './search-mono-class.service';

@Injectable()
export class SearchMonoClassEffects {
  constructor(
    private actions$: Actions,
    private searchService: SearchService,
    private searchMonoClassService: SearchMonoClassService,
    private store: Store<any>
  ) {}

  selectedMonoClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMonoClassActions.selectMonoClassSearch),
      map(() => {
        const condition: NormalizedCondition = this.searchMonoClassService.initNormalizedConditionComposed(null);
        return SearchMonoClassActions.addFirstNormalizedCondition({ condition });
      })
    )
  );

  addNormalizedConditionAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMonoClassActions.addNormalizedConditionAttributeForConditionId),
      mergeMap((action) =>
        combineLatest([of(action), this.store.select(FieldSelectors.fieldById(action.attribute.field))]).pipe(first())
      ),
      map(([action, field]) => {
        const pattern = this.searchMonoClassService.getPatternForField(field);
        const isDate = field.type === FieldType.INSTANT;
        const condition: NormalizedCondition = {
          ...this.searchMonoClassService.initNormalizedConditionAttribute(action.conditionId, action.attribute.id),
          isDate,
          pattern
        };

        return SearchMonoClassActions.addNormalizedConditionForConditionId({
          conditionId: action.conditionId,
          condition
        });
      })
    )
  );

  addNormalizedConditionComposed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMonoClassActions.addNormalizedConditionComposedForConditionId),
      map((action) => {
        const condition: NormalizedCondition = this.searchMonoClassService.initNormalizedConditionComposed(
          action.conditionId
        );
        return SearchMonoClassActions.addNormalizedConditionForConditionId({
          conditionId: action.conditionId,
          condition
        });
      })
    )
  );

  deleteNormalizedCondition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMonoClassActions.deleteNormalizedConditionById),
      mergeMap((action) =>
        combineLatest([
          of(action),
          this.store.select(SearchMonoClassSelectors.selectMonoClassConditionsById(action.conditionId))
        ]).pipe(first())
      ),
      switchMap(([action, condition]) => {
        const actionCondition$ = SearchMonoClassActions.deleteNormalizedCondition({ condition });
        const actionParent$ = SearchMonoClassActions.removeConditionFromComposed({
          parentId: condition.parentId ?? null,
          childrenId: condition.id
        });
        const actionsComposed$ = condition.composed?.map((id: string) =>
          SearchMonoClassActions.deleteNormalizedConditionById({ conditionId: id })
        );
        return actionsComposed$
          ? [actionCondition$, actionParent$, ...actionsComposed$]
          : [actionCondition$, actionParent$];
      })
    )
  );

  actionMonoClassSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMonoClassActions.search, SearchMonoClassActions.save),
      withLatestFrom(
        this.store.select(SearchMonoClassSelectors.selectMonoClassIdSearch),
        this.store.select(SearchMonoClassSelectors.selectMonoClassConditionsMasterId),
        this.store.select(SearchMonoClassSelectors.selectMonoClassConditions),
        this.store.select(SearchMonoClassSelectors.order),
        this.store.select(DataSourceSelectors.currentEdit)
      ),
      map(([action, oClass, masterId, conditions, order, currentEdit]) => {
        const payload = this.searchMonoClassService.buildMonoClassSearchPayloadForSearch(
          oClass ?? '',
          masterId ?? '',
          conditions,
          order
        );
        if (action.type === SearchMonoClassActions.save.type && DEFAULT_NAMED_QUERY_ID !== action?.id) {
          return DataSourceActions.namedQuery.post({
            id: action.id ?? currentEdit?.id,
            name: action.descriptionQuery.name,
            description: action.descriptionQuery?.description,
            visibility: action.descriptionQuery?.visibility,
            payload,
            color: currentEdit?.color,
            favorite: currentEdit?.favorite ?? false,
            isEdit: !!currentEdit
          });
        }
        return SearchActions.search({ payload });
      })
    )
  );

  loadExistingConditions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMonoClassActions.loadExistingConditions),
      withLatestFrom(this.store.select(ClassSelectors.classes), this.store.select(FieldSelectors.fields)),
      mergeMap(([action, classes, fields]) => {
        const { oClass, condition, sort } = action.payload;
        const masterId = uuidv4();
        const conditions = this.searchMonoClassService.loadNormalizedConditions(
          condition,
          masterId,
          classes,
          fields,
          masterId,
          sort
        ).conditions;
        const ids = conditions.map((cond) => cond.id);
        const entities = conditions.reduce((acc, cond) => ({ ...acc, [cond.id]: cond }), {});
        return [
          SearchMonoClassActions.addIdMaster({ id: masterId }),
          SearchMonoClassActions.addIdCondition({ ids }),
          SearchMonoClassActions.addEntities({ entities }),
          SearchMonoClassActions.addIdClass({ id: oClass }),
          SearchMonoClassActions.addOrder({ attribute: sort?.attribute, asc: sort?.direction as OrderValue })
        ];
      })
    )
  );

  addEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.openEdit),
      withLatestFrom(this.store.select(DataSourceSelectors.currentEdit)),
      mergeMap(([action, currentEdit]) => {
        const actions = [] as Action[];
        if (!!currentEdit) {
          const type = DatasourceUtils.getTypeFromPayload(currentEdit.request);
          if (type === NamedQueryTypes.MULTI_CLASS) {
            actions.push(
              SearchMultiClassActions.loadExistingConditions({
                payload: currentEdit.request as MultiClassSearchPayload
              })
            );
          }
          if (type === NamedQueryTypes.MONO_CLASS) {
            actions.push(
              SearchMonoClassActions.loadExistingConditions({ payload: currentEdit.request as MonoClassSearchPayload })
            );
          }
        }
        return actions;
      }),
      catchError((error) => [DataSourceActions.namedQuery.failure({ error })])
    )
  );

  stopEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DataSourceActions.namedQuery.stopEdit),
      mergeMap(() => [SearchMultiClassActions.resetSearch(), SearchMonoClassActions.resetSearch()])
    )
  );
}
