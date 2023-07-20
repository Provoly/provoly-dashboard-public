import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PryI18nService, PrySnackbarService } from '@provoly/dashboard';
import { of } from 'rxjs';
import { catchError, debounceTime, map, mergeMap } from 'rxjs/operators';
import { PryTransfo } from '../components/pipeline-editor/pipeline.interface';
import { PipelineActions } from './pipeline.actions';
import { PipelineService } from './pipeline.service';

@Injectable()
export class PipelineEffects {
  callCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineActions.check),
      debounceTime(100),
      mergeMap((action) =>
        this.pipelineService.check(action.graph).pipe(
          map((response) => {
            if (action.fetch) {
              return PipelineActions.fetchTransfosList();
            } else {
              return PipelineActions.setResponse({ response });
            }
          }),
          catchError((response: HttpErrorResponse) => {
            let code = 'GENERIC_ERROR';
            const params = {} as { [key: string]: string };
            switch (response.status) {
              case 404:
                code = 'GRAPH_CANNOT_BE_PARSED';
                break;
              default:
                params['error'] = `${response.status} - ${response.message}`;
            }
            return of(
              PipelineActions.setResponse({
                response: {
                  id: action.graph.id,
                  errors: [{ code, params }],
                  status: []
                }
              })
            );
          })
        )
      )
    )
  );

  listTransfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineActions.fetchTransfosList),
      mergeMap((action) =>
        this.pipelineService.list().pipe(
          map((transfos) => PipelineActions.fetchTransfosListSuccess({ transfos })),
          catchError((error) => [PipelineActions.fetchTransfosListFailure({ error: error })])
        )
      )
    )
  );

  toggleTransfoActivation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineActions.toggleActivation),
      mergeMap((action) => {
        if (action.transfo.active) {
          return this.pipelineService.deactivate(action.transfo.id).pipe(
            map(() => PipelineActions.fetchTransfosList()),
            catchError((error) => {
              this.snackBar.open({
                message: this.translate.instant('@pry.pipeline.deactivateError'),
                type: 'error'
              });
              return [PipelineActions.activationError({ id: action.transfo.id, error: error })];
            })
          );
        }
        return this.pipelineService.activate(action.transfo.id).pipe(
          map(() => PipelineActions.fetchTransfosList()),
          catchError((error) => {
            this.snackBar.open({
              message: this.translate.instant('@pry.pipeline.activateError'),
              type: 'error'
            });
            return [PipelineActions.activationError({ id: action.transfo.id, error: error })];
          })
        );
      })
    )
  );

  executeTransfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineActions.executeTransfo),
      mergeMap((action) => this.pipelineService.execute(action.id).pipe(map(() => PipelineActions.fetchTransfosList())))
    )
  );

  getTransformation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PipelineActions.getTransformation),
      mergeMap((action) =>
        this.pipelineService
          .get(action.id)
          .pipe(map((transfo: PryTransfo) => PipelineActions.getTransformationSuccess({ transfo })))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private pipelineService: PipelineService,
    private snackBar: PrySnackbarService,
    private translate: PryI18nService
  ) {}
}
