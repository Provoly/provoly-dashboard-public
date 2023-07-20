import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { RelationType, RelationTypesActions, RelationTypesSelectors } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';

@Component({
  selector: 'pry-admin-relation-types',
  templateUrl: './admin-relation-types.component.html'
})
export class AdminRelationTypesComponent {
  relationTypes: Observable<RelationType[]>;
  selectedRelationType$: Observable<RelationType | undefined>;

  sortActive? = 'name';
  sortDirection? = 'asc';

  constructor(private store: Store<AdminRelationTypesComponent>) {
    this.store.dispatch(RelationTypesActions.load());
    this.store.dispatch(RelationTypesActions.unSelectRelationType());
    this.relationTypes = this.store.select(RelationTypesSelectors.relationsTypes);
    this.selectedRelationType$ = this.store.select(RelationTypesSelectors.selectedRelationType);

    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: RelationTypesActions.openModal(),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'relation_types',
            actionAccess: 'write'
          }
        ]
      })
    );
  }

  selectlink(link: any) {
    this.store.dispatch(RelationTypesActions.selectRelationType({ id: link.id }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminRelationTypesSelectComponent' }));
  }
}
