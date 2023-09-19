import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RelationType, RelationTypesActions, RelationTypesSelectors } from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';

@Component({
  selector: 'pry-admin-relation-types-select',
  templateUrl: './admin-relation-types-select.component.html'
})
export class AdminRelationTypesSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminRelationTypesSelectComponent';
  currentRelationType$: Observable<RelationType | undefined>;
  sub = new Subscription();

  constructor(private store: Store<AdminRelationTypesSelectComponent>) {
    this.currentRelationType$ = this.store.select(RelationTypesSelectors.selectedRelationType);
  }

  ngOnInit(): void {
    this.sub.add(
      this.currentRelationType$.subscribe((relationType) => {
        if (relationType) {
          this.store.dispatch(
            AdminActions.mainActions({
              actions: [
                {
                  action: RelationTypesActions.openModal(),
                  label: 'edit',
                  icon: 'edit',
                  moduleAccess: 'admin',
                  pageAccess: 'relation_types',
                  actionAccess: 'write'
                }
              ]
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  closePanel() {
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.store.dispatch(RelationTypesActions.unSelectRelationType());
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
}
