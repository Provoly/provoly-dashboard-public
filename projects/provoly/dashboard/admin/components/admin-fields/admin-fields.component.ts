import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClassActions, ClassSelectors, Field, FIELD_OPTIONS, FieldActions, FieldSelectors } from '@provoly/dashboard';
import { map, Observable, of, switchMap, zip } from 'rxjs';
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

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(FieldsActions.unselectField());
    this.currentFieldId$ = this.store.select(FieldsSelectors.selectedFieldId);

    this.fields$ = this.store.select(FieldSelectors.fields).pipe(
      switchMap((fields: Field[]) =>
        zip(fields.map((field) => zip(of(field), this.store.select(ClassSelectors.attributesByFieldId(field.id)))))
      ),
      map((superFields) =>
        superFields.map(([field, attributes]) => ({ ...field, attributes: attributes?.length ?? 0 } as FieldExtended))
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

  getTranslationType(type: string) {
    return FIELD_OPTIONS.find((el) => el.varType === type)?.translation || 'undefined';
  }
}
