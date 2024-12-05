import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  CategoryActions,
  ClassActions,
  PryDialogConfirmComponent,
  PryDialogConfirmData,
  PryDialogService
} from '@provoly/dashboard';
import { catchError, map, mergeMap, tap } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminService } from '../../../store/admin.service';
import { AdminClassActions } from './admin-class.actions';

@Injectable()
export class AdminClassEffects {
  updateToolbox$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.updateToolbox),
      mergeMap((action) => {
        return [ClassActions.load({ force: true }), AdminActions.selectComponentType({ componentType: null })];
      })
    )
  );

  saveClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.saveClass),
      mergeMap((action) => {
        if (action.class.attributes.length === 0) {
          const data: PryDialogConfirmData = {
            title: '@pry.admin.infoModalTitle',
            message: '@pry.admin.classes.createClassModalMessage',
            actions: [{ id: 0, label: '@pry.admin.closeModale' }]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
          return [];
        }

        return this.adminService.saveClass(action.class).pipe(
          map(() => AdminClassActions.saveClassSuccess({ route: action.route })),
          catchError((error) => [AdminClassActions.saveClassFailure({ error: error })])
        );
      })
    )
  );

  saveInterClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.saveInterClass),
      mergeMap((action) => {
        return [AdminActions.routeTo({ path: action.route }), ClassActions.load({ force: true })];
      })
    )
  );

  saveClassSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.saveClassSuccess),
      mergeMap((action) => {
        return [AdminActions.routeTo({ path: action.route }), ClassActions.load({ force: true })];
      })
    )
  );

  saveAttributeForClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.saveAttributeForClass),
      mergeMap((action) =>
        this.adminService.saveAttributeForClass(action.classId, action.attribute).pipe(
          map(() => AdminClassActions.saveAttributeForClassSuccess({ route: action.route })),
          catchError((error) => [AdminClassActions.saveAttributeForClassFailure({ error: error })])
        )
      )
    )
  );

  saveAttributeForClassSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.saveAttributeForClassSuccess),
      mergeMap((action) => {
        return [AdminActions.routeTo({ path: action.route }), ClassActions.load({ force: true })];
      })
    )
  );

  deleteClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.deleteClass),
      mergeMap((action) =>
        this.adminService.deleteClass(action.id).pipe(
          map(() => AdminClassActions.deleteClassSuccess({ route: action.route })),
          catchError((error) => [AdminClassActions.deleteClassFailure({ error: error })])
        )
      )
    )
  );

  deleteClassSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.deleteClassSuccess),
      mergeMap((action) => {
        return [
          AdminClassActions.updateToolbox(),
          AdminActions.mainActions({
            actions: [
              {
                action: AdminActions.routeTo({ path: action.route }),
                label: 'add',
                icon: 'add_column',
                moduleAccess: 'admin',
                pageAccess: 'classes',
                actionAccess: 'write'
              }
            ]
          }),
          ClassActions.load({ force: true })
        ];
      })
    )
  );

  deleteAttributeForClass$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.deleteAttributeForClass),
      mergeMap((action) =>
        this.adminService.deleteAttributeForClass(action.classId, action.attrId).pipe(
          map(() =>
            AdminClassActions.deleteAttributeForClassSuccess({
              classId: action.classId,
              backPath: action.backPath,
              addAttrPath: action.addAttrPath
            })
          ),
          catchError((error) => [AdminClassActions.deleteAttributeForClassFailure({ error: error })])
        )
      )
    )
  );

  deleteAttributeForClassSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.deleteAttributeForClassSuccess),
      mergeMap((action) => {
        return [
          AdminClassActions.updateToolbox(),
          AdminActions.mainActions({
            actions: [
              {
                action: AdminActions.routeTo({ path: action.backPath }),
                label: 'back',
                icon: 'arrow_back'
              },
              {
                action: AdminActions.routeTo({ path: action.addAttrPath }),
                label: 'add',
                icon: 'add_column',
                moduleAccess: 'admin',
                pageAccess: 'classes',
                actionAccess: 'write'
              }
            ]
          }),
          ClassActions.load({ force: true })
        ];
      })
    )
  );

  saveCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.saveCategory),
      mergeMap((action) =>
        this.adminService.saveCategory(action.category).pipe(
          map(() => AdminClassActions.saveCategorySuccess()),
          catchError((error) => [AdminClassActions.saveCategoryFailure({ error: error })])
        )
      )
    )
  );

  saveCategorySuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.saveCategorySuccess),
      map((action) => {
        return CategoryActions.load({ force: true });
      })
    )
  );

  back$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.back),
      map((action) => {
        return AdminActions.routeTo({ path: action.path });
      })
    )
  );

  confirmClassDeletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AdminClassActions.confirmClassDeletion),
        tap((action) => {
          const data: PryDialogConfirmData = {
            title: '@pry.admin.classes.deleteClassConfirmMessage',
            actions: [
              {
                id: 0,
                label: '@pry.admin.validate',
                actions: [AdminClassActions.deleteClass({ id: action.id, route: action.path })]
              },
              { id: 1, label: '@pry.admin.cancel' }
            ]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
        })
      ),
    { dispatch: false }
  );

  confirmAttributeDeletion$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AdminClassActions.confirmAttributeDeletion),
        tap((action) => {
          const data: PryDialogConfirmData = {
            title: '@pry.admin.deleteAttributeConfirmMessage',
            actions: [
              {
                id: 0,
                label: '@pry.admin.validate',
                actions: [
                  AdminClassActions.deleteAttributeForClass({
                    classId: action.classId,
                    attrId: action.attrId,
                    backPath: action.backPath,
                    addAttrPath: action.addAttrPath
                  })
                ]
              },
              {
                id: 1,
                label: '@pry.admin.cancel'
              }
            ]
          };
          this.pryDialog.open(PryDialogConfirmComponent, { data });
        })
      ),
    { dispatch: false }
  );

  getStorageOptions = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminClassActions.getStorageOptions),
      mergeMap(() => {
        return this.adminService.getStorageOptions().pipe(
          map((storageOptions) => AdminClassActions.getStorageOptionsSuccess({ storageOptions })),
          catchError((error) => [AdminClassActions.getStorageOptionsFailure({ error: error })])
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService,
    private pryDialog: PryDialogService,
    private service: AdminService
  ) {}
}
