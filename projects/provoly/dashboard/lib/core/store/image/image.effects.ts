import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, map, mergeMap } from 'rxjs';
import { ImageActions } from './image.actions';
import { ImageService } from './image.service';

@Injectable()
export class ImageEffects {
  loadImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.load),
      debounceTime(50),
      mergeMap(() =>
        this.imageService.getImages().pipe(
          map((images) => ImageActions.loadSuccess({ images })),
          catchError((error) => [ImageActions.loadFailure({ error })])
        )
      )
    )
  );

  addImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImageActions.add),
      mergeMap((action) =>
        this.imageService.upload(action.file, action.mediaType, action.imageType).pipe(
          mergeMap((name) => [ImageActions.load(), ImageActions.added({ name })]),
          catchError((error) => [ImageActions.loadFailure({ error })])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private imageService: ImageService
  ) {}
}
