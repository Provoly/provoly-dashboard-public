import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MetadataRules, MetadataRulesCreate } from '@provoly/dashboard';
import { catchError, switchMap } from 'rxjs';
import { map, mergeMap } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { AdminMetadataRulesActions } from './metadata-rules.actions';

@Injectable()
export class AdminMetadataRulesEffects {
  constructor(
    private actions$: Actions,
    private service: AdminService,
    private router: Router
  ) {}

  getMetadataRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataRulesActions.load),
      switchMap(() => this.service.getMetadataRulesList()),
      map((list: MetadataRules[]) => AdminMetadataRulesActions.loaded({ list })),
      catchError((error: any) => [AdminMetadataRulesActions.failure({ error })])
    )
  );

  postMetadataRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataRulesActions.post),
      switchMap((props: { metadata: MetadataRulesCreate }) => this.service.addMetadataRules(props.metadata)),
      map(() => {
        AdminMetadataRulesActions.load();
        AdminMetadataRulesActions.unselectMetadata();
        const path = this.router.createUrlTree(['admin/metadata-rules']);
        return AdminActions.routeTo({ path: path.toString(), params: undefined });
      }),
      catchError((error: any) => [AdminMetadataRulesActions.failure({ error })])
    )
  );

  deleteMetadataRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataRulesActions.delete),
      mergeMap((action) =>
        this.service.deleteMetadataRules(action.name).pipe(
          mergeMap(() => {
            return [
              AdminMetadataRulesActions.load(),
              AdminActions.selectComponentType({ componentType: null }),
              AdminActions.mainActions({
                actions: [
                  {
                    action: AdminActions.routeTo({ path: action.addRoute }),
                    label: 'add',
                    icon: 'add_column',
                    moduleAccess: 'admin',
                    pageAccess: 'metadata_rules',
                    actionAccess: 'write'
                  }
                ]
              })
            ];
          }),
          catchError((error) => [AdminMetadataRulesActions.failure({ error })])
        )
      )
    )
  );

  openNewMetadataRules$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminMetadataRulesActions.openNewMetadataRules),
      map((action) => {
        return AdminActions.routeTo({ path: action.route });
      })
    )
  );
}
