import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {Associations, AttributeExtended, BaseToolboxAction, Class} from '@provoly/dashboard';
import { combineLatestWith, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../../store/admin.actions';
import { AdminClassActions } from '../../store/admin-class.actions';
import { AdminClassSelectors } from '../../store/admin-class.selectors';
import {AdminSelectors} from "../../../../store/admin.selectors";

let nextCompId = 0;

@Component({
  selector: 'pry-admin-attribute-select',
  templateUrl: './admin-attributes-select.component.html'
})
export class AdminAttributesSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminAttributesSelectComponent';
  compId: number;
  selectedAttribute$: Observable<AttributeExtended | undefined>;
  sub = new Subscription();
  associations$: Observable<Associations | undefined>;

  tab: number = 0;
  private classId?: string;
  private selectedClassId$: Observable<string | undefined>;
  private interClassId$: Observable<string | undefined>;
  interClass$: Observable<Class | undefined>;
  interClass?: Class;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectedAttribute$ = this.store.select(AdminClassSelectors.selectedAttribute);
    this.selectedClassId$ = this.store.select(AdminClassSelectors.selectedClassId);
    this.interClass$ = this.store.select(AdminClassSelectors.interClass);
    this.interClassId$ = this.store.select(AdminClassSelectors.interClassId);
    this.compId = nextCompId++;
    this.associations$ = this.store.select(AdminSelectors.selectedAssociation);
  }

  ngOnInit(): void {
    this.sub.add(
      this.interClass$.subscribe((interClass) => {
        this.interClass = interClass;
      })
    );
    this.sub.add(
      this.selectedClassId$.pipe(combineLatestWith(this.interClassId$)).subscribe(([selectClassid, interClassId]) => {
        this.classId = selectClassid ?? interClassId;
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  closePanel() {
    this.store.dispatch(AdminClassActions.unselectAttribute());
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    if (this.classId) {
      const path = this.router.createUrlTree(['.', 'classes', this.classId, 'new'], { relativeTo: this.route });
      const backPath = this.router.createUrlTree(['classes'], { relativeTo: this.route }).toString();
      const savePath = this.router.createUrlTree(['..'], { relativeTo: this.route }).toString();
      const actions: BaseToolboxAction[] = [
        {
          action: AdminClassActions.back({ path: backPath }),
          label: 'back',
          icon: 'arrow_back'
        },
        {
          action: AdminActions.routeTo({ path: path.toString() }),
          label: 'addAttribute',
          icon: 'add_column',
          moduleAccess: 'admin',
          pageAccess: 'classes',
          actionAccess: 'write'
        }
      ];
      if (this.interClass) {
        actions.push({
          action: AdminClassActions.saveClass({ class: this.interClass, route: savePath }),
          label: 'addClass',
          icon: 'add_column',
          moduleAccess: 'admin',
          pageAccess: 'classes',
          actionAccess: 'write'
        });
      }
      this.store.dispatch(
        AdminActions.mainActions({
          actions
        })
      );
    }
  }

  switch(number: number) {
    this.tab = number;
  }
}
