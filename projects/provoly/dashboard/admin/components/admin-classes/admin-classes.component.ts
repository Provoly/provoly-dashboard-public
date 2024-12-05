import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Class, ClassActions, ClassSelectors, ConfigActions, DatasetCount } from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { AdminClassActions } from './store/admin-class.actions';
import { AdminClassSelectors } from './store/admin-class.selectors';

@Component({
  selector: 'pry-admin-classes',
  templateUrl: './admin-classes.component.html'
})
export class AdminClassesComponent implements OnInit, OnDestroy {
  classes$: Observable<Class[]>;
  selectedClassId$: Observable<string | undefined>;
  datasetCounts$: Observable<DatasetCount[]>;
  classesInputFlows$: Observable<any[]>;
  sortActive? = 'name';
  sortDirection? = 'asc';
  sub = new Subscription();

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(ClassActions.loadDatasetCount());
    this.store.dispatch(ClassActions.load({}));
    this.store.dispatch(AdminClassActions.unselectClass());
    this.store.dispatch(AdminClassActions.resetInterClass());
    this.store.dispatch(ConfigActions.loadCustomization({}));
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.selectedClassId$ = this.store.select(AdminClassSelectors.selectedClassId);
    this.datasetCounts$ = this.store.select(ClassSelectors.datasetCounts);
    this.classesInputFlows$ = combineLatest([this.classes$, this.datasetCounts$]).pipe(
      map(([classes, datasetCounts]) => {
        return classes.map((item) => ({
          name: item.name,
          id: item.id,
          count: datasetCounts.find((datasetCount) => datasetCount.id === item.id)?.count || 0
        }));
      })
    );
  }

  ngOnInit(): void {
    const path = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  viewAttributesClass(clazz: Class) {
    this.store.dispatch(AdminClassActions.selectClass({ clazz: clazz }));
    const path = this.router.createUrlTree(['.', clazz.id], { relativeTo: this.route });
    this.store.dispatch(AdminActions.routeTo({ path: path.toString() }));
  }

  selectClass(clazz: Class) {
    this.store.dispatch(AdminActions.fetchClassAssociations({ id: clazz.id }));
    this.store.dispatch(AdminClassActions.selectClass({ clazz: clazz }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminClassesSelectComponent' }));
  }
}
