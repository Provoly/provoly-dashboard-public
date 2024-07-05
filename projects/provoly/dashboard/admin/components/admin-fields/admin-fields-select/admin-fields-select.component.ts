import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Associations, ClassSelectors, FIELD_I18N, Field, FieldType } from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { FieldsActions } from '../store/fields.actions';
import { FieldsSelectors } from '../store/fields.selectors';
import { AdminSelectors } from '../../../store/admin.selectors';

@Component({
  selector: 'pry-admin-fields-select',
  templateUrl: './admin-fields-select.component.html'
})
export class AdminFieldsSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminFieldsSelectComponent';
  currentField$: Observable<Field | undefined>;
  associations$: Observable<Associations | undefined>;
  sub = new Subscription();
  attributes$: Observable<{ technicalName: string; classId: string }[]>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentField$ = this.store.select(FieldsSelectors.selectedField);
    this.associations$ = this.store.select(AdminSelectors.selectedAssociation);
    this.attributes$ = combineLatest([this.currentField$, store.select(ClassSelectors.classes)]).pipe(
      map(([field, classes]) => {
        return classes
          .map((clazz) =>
            clazz.attributes
              .filter((attribute) => attribute.field === field?.id)
              .map((attribute) => ({ technicalName: attribute.technicalName, classId: clazz.id }))
          )
          .flat();
      })
    );
  }

  ngOnInit(): void {
    this.sub.add(
      this.currentField$.pipe(concatLatestFrom((field) => this.attributes$)).subscribe(([curField, attributes]) => {
        const back = this.router.createUrlTree(['.', 'fields'], { relativeTo: this.route }).toString();
        let editPath = this.router
          .createUrlTree(['fields', 'edit', curField?.id], { relativeTo: this.route })
          .toString();
        if (curField) {
          this.store.dispatch(
            AdminActions.mainActions({
              actions: [
                {
                  action: AdminActions.routeTo({ path: editPath }),
                  label: 'edit',
                  icon: 'edit',
                  moduleAccess: 'admin',
                  pageAccess: 'fields',
                  actionAccess: 'write'
                },
                {
                  action: FieldsActions.confirmFieldDeletion({ id: curField.id, path: back }),
                  label: 'delete',
                  icon: 'delete',
                  moduleAccess: 'admin',
                  pageAccess: 'classes',
                  actionAccess: 'write',
                  disabled: attributes.length > 0
                }
              ]
            })
          );
        }
      })
    );
  }

  closePanel() {
    this.store.dispatch(FieldsActions.unselectField());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    let path = this.router.createUrlTree(['fields', 'new'], { relativeTo: this.route });
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'fields',
            actionAccess: 'write'
          }
        ]
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  protected readonly FIELD_I18N = FIELD_I18N;
  protected readonly FieldType = FieldType;
}
