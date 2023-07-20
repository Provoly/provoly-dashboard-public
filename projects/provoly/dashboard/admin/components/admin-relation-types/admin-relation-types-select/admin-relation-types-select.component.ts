import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RelationType, RelationTypesActions, RelationTypesSelectors } from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';

let nextCompId = 0;

@Component({
  selector: 'pry-admin-relation-types-select',
  templateUrl: './admin-relation-types-select.component.html'
})
export class AdminRelationTypesSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminRelationTypesSelectComponent';
  compId: number;
  currentRelationType$: Observable<RelationType | undefined>;
  sub = new Subscription();
  tab: number = 0;

  constructor(private store: Store<AdminRelationTypesSelectComponent>) {
    this.currentRelationType$ = this.store.select(RelationTypesSelectors.selectedRelationType);
    this.compId = nextCompId++;
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
