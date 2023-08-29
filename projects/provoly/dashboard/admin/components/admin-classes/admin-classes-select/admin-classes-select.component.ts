import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatLatestFrom } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Associations, Class, DataSourceSelectors } from '@provoly/dashboard';
import { map, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminClassActions } from '../store/admin-class.actions';
import { AdminClassSelectors } from '../store/admin-class.selectors';
import { AdminSelectors } from '../../../store/admin.selectors';

let nextCompId = 0;

@Component({
  selector: 'pry-admin-classes-select',
  templateUrl: './admin-classes-select.component.html'
})
export class AdminClassesSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminClassesSelectComponent';
  compId: number;
  tab: number = 0;
  sub = new Subscription();
  currentClass$: Observable<Class | undefined>;
  linkedObjects$: Observable<any[]>;
  associations$: Observable<Associations | undefined>;

  constructor(private store: Store<any>, private router: Router, private route: ActivatedRoute) {
    this.currentClass$ = this.store.select(AdminClassSelectors.selectedClass);
    this.associations$ = this.store.select(AdminSelectors.selectedAssociation);
    this.compId = nextCompId++;
    this.linkedObjects$ = this.currentClass$.pipe(
      concatLatestFrom((clazz) => this.store.select(DataSourceSelectors.datasets)),
      map(([clazz, datasets]) => datasets.filter((dataset) => dataset.oClass === clazz?.id))
    );
  }

  ngOnInit(): void {
    this.sub.add(
      this.currentClass$.pipe(concatLatestFrom((clazz) => this.linkedObjects$)).subscribe(([clazz, linkedObjects]) => {
        if (clazz) {
          const newPath = this.router.createUrlTree(['.', 'classes', 'new'], { relativeTo: this.route });
          const editPath = this.router.createUrlTree(['.', 'classes', clazz.id, 'edit'], { relativeTo: this.route });
          const customizePath = this.router.createUrlTree(['.', 'classes', clazz.id, 'customize'], {
            relativeTo: this.route
          });
          const viewAttributesPath = this.router.createUrlTree(['.', 'classes', clazz.id], {
            relativeTo: this.route
          });
          this.store.dispatch(
            AdminActions.mainActions({
              actions: [
                {
                  action: AdminActions.routeTo({ path: editPath.toString() }),
                  label: 'rename',
                  icon: 'edit',
                  moduleAccess: 'admin',
                  pageAccess: 'classes',
                  actionAccess: 'write'
                },
                {
                  action: AdminClassActions.confirmClassDeletion({ id: clazz.id, path: newPath.toString() }),
                  label: 'delete',
                  icon: 'delete',
                  moduleAccess: 'admin',
                  pageAccess: 'classes',
                  actionAccess: 'write',
                  disabled: linkedObjects.length > 0
                },
                {
                  action: AdminActions.routeTo({ path: customizePath.toString() }),
                  label: 'customize.title',
                  icon: 'chat-settings',
                  moduleAccess: 'admin',
                  pageAccess: 'classes',
                  actionAccess: 'write'
                },
                {
                  action: AdminActions.routeTo({ path: viewAttributesPath.toString() }),
                  label: 'edit',
                  icon: 'admin',
                  moduleAccess: 'admin',
                  pageAccess: 'classes',
                  actionAccess: 'write'
                }
              ]
            })
          );
        }
      })
    );
  }

  switch(number: number) {
    this.tab = number;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  closePanel() {
    const path = this.router.createUrlTree(['.', 'classes', 'new'], { relativeTo: this.route });
    this.store.dispatch(AdminClassActions.unselectClass());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'classes',
            actionAccess: 'write'
          }
        ]
      })
    );
  }
}
