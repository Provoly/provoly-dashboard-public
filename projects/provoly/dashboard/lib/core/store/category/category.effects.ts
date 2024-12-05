import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, filter, map, mergeMap, withLatestFrom } from 'rxjs';
import { CategoryActions } from './category.actions';
import { CategoryService } from './category.service';
import { CategorySelectors } from './category.selectors';
import { Store } from '@ngrx/store';
import { DashboardSelectors } from '../../../dashboard/store/dashboard.selectors';

@Injectable()
export class CategoryEffects {
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.load),
      withLatestFrom(this.store.select(CategorySelectors.categories), this.store.select(DashboardSelectors.rank)),
      debounceTime(200),
      filter(([action, categories, rank]) => (action.force || categories.length === 0) && rank === 0),
      mergeMap((action) =>
        this.categoryService.getCategories().pipe(
          map((categories) => CategoryActions.loadSuccess({ categories })),
          catchError((error) => [CategoryActions.loadFailure({ error: error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService,
    private store: Store
  ) {}
}
