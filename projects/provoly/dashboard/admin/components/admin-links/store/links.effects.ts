import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { LinksActions } from './links.actions';

@Injectable()
export class LinksEffects {
  loadLinks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.loadLinks),
      mergeMap((action) =>
        this.service.getLinks().pipe(
          map((datas) => LinksActions.loadLinksSuccess({ datas })),
          catchError((error) => [LinksActions.loadLinksFailure({ error })])
        )
      )
    )
  );

  saveLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.saveLink),
      mergeMap((action) =>
        this.service.saveLink(action.link).pipe(
          map((data) => LinksActions.saveLinkSuccess({ route: action.route })),
          catchError((error) => [LinksActions.saveLinkFailure({ error })])
        )
      )
    )
  );

  saveLinkSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.saveLinkSuccess),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
      })
    )
  );

  constructor(
    private actions$: Actions,
    private service: AdminService,
    private router: Router
  ) {}
}
