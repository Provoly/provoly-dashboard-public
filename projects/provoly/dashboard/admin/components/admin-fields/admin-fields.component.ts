import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Class,
  ClassActions,
  ClassSelectors,
  FIELD_I18N,
  FieldActions,
  FieldSelectors
} from '@provoly/dashboard';
import { map, Observable, combineLatest } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { FieldExtended } from './store/admin-fields.model';
import { FieldsActions } from './store/fields.actions';
import { FieldsSelectors } from './store/fields.selectors';

@Component({
  selector: 'pry-admin-fields',
  templateUrl: './admin-fields.component.html'
})
export class AdminFieldsComponent {
  fields$: Observable<FieldExtended[]>;

  sortActive? = 'name';
  sortDirection? = 'asc';
  currentFieldId$: Observable<string | undefined>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(FieldsActions.unselectField());
    this.currentFieldId$ = this.store.select(FieldsSelectors.selectedFieldId);

    this.fields$ = combineLatest([
      this.store.select(FieldSelectors.fields),
      this.store.select(ClassSelectors.classes)
    ]).pipe(
      map(([fields, classes]) =>
        fields.map((f) => ({
          ...f,
          attributeCount: classes.reduce(
            (p: number, c: Class) => p + c.attributes.filter((a) => a.field.id === f.id).length,
            0
          )
        }))
      )
    );
    const path = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
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

  selectField(field: any) {
    this.store.dispatch(FieldsActions.selectField({ field: field }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminFieldsSelectComponent' }));
    this.store.dispatch(AdminActions.fetchFieldAssociations({ id: field.id }));
  }

  protected readonly FIELD_I18N = FIELD_I18N;
}
