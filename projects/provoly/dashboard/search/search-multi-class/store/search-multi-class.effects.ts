import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  ClassSelectors,
  DataSourceActions,
  DataSourceSelectors,
  DEFAULT_NAMED_QUERY_ID,
  FieldSelectors,
  FieldType,
  MultiClassCondition,
  SearchActions
} from '@provoly/dashboard';
import { combineLatest } from 'rxjs';
import { filter, first, map, mergeMap, withLatestFrom } from 'rxjs';
import { SearchMultiClassActions } from './search-multi-class.actions';
import { SearchMultiClassSelectors } from './search-multi-class.selectors';
import { SearchMultiClassService } from './search-multi-class.service';

@Injectable()
export class SearchMultiClassEffects {
  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private multiClassService: SearchMultiClassService
  ) {}

  addCondition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMultiClassActions.addNewEmptyCondition),
      map(() => {
        const condition = this.multiClassService.generateCondition();
        return SearchMultiClassActions.addMultiClassCondition({ condition });
      })
    )
  );
  updateConditionField$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMultiClassActions.updateConditionField),
      mergeMap((action) =>
        combineLatest([
          this.store
            .select(SearchMultiClassSelectors.getConditionById(action.conditionId))
            .pipe(filter((c): c is MultiClassCondition => c !== undefined)),
          this.store.select(FieldSelectors.fieldById(action.field))
        ]).pipe(first())
      ),
      map(([condition, field]) => {
        const pattern = this.multiClassService.getPatternForField(field);
        const isDate = field.type === FieldType.INSTANT;
        return SearchMultiClassActions.updateConditionPattern({
          conditionId: condition.id,
          pattern,
          isDate
        });
      })
    )
  );

  actionMultiClassSearch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchMultiClassActions.search, SearchMultiClassActions.save),
      withLatestFrom(
        this.store.select(SearchMultiClassSelectors.conditions),
        this.store.select(SearchMultiClassSelectors.multiType),
        this.store.select(ClassSelectors.classes),
        this.store.select(DataSourceSelectors.currentEdit)
      ),
      map(([action, conditions, multiType, classes, currentEdit]) => {
        const payload = this.multiClassService.buildConditionsToSearchPayload(conditions, classes, multiType);
        if (action.type === SearchMultiClassActions.save.type && DEFAULT_NAMED_QUERY_ID !== currentEdit?.id) {
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
      ofType(SearchMultiClassActions.loadExistingConditions),
      withLatestFrom(this.store.select(FieldSelectors.fields)),
      mergeMap(([action, fields]) => {
        const conditions = this.multiClassService.getConditionsFromSearchPayload(action.payload, fields);
        const multiType = action.payload.multiType;
        return [
          SearchMultiClassActions.updateConditions({ conditions }),
          SearchMultiClassActions.updateMultiType({ multiType })
        ];
      })
    )
  );
}
