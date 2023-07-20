import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { CategoryActions } from './category.actions';
import { CategoryService } from './category.service';

@Injectable()
export class CategoryEffects {
  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.load),
      debounceTime(200),
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
    private categoryService: CategoryService
  ) {}
}
