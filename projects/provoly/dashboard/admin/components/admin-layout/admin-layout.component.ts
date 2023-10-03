import { AfterViewInit, Component, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseLayoutComponent, BaseToolboxAction } from '@provoly/dashboard';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { AdminSelectors } from '../../store/admin.selectors';
import { AdminClassesSelectComponent } from '../admin-classes/admin-classes-select/admin-classes-select.component';
import { AdminAttributesSelectComponent } from '../admin-classes/admin-classes-view/admin-attributes-select/admin-attributes-select.component';
import { AdminSelectDatasetComponent } from '../admin-dataset/admin-select-dataset/admin-select-dataset.component';
import { AdminEnvironmentSelectComponent } from '../admin-environment/admin-environment-select/admin-environment-select.component';
import { AdminFieldsSelectComponent } from '../admin-fields/admin-fields-select/admin-fields-select.component';
import { AdminSelectMetadataRulesComponent } from '../admin-metadata-rules/admin-select-metadata-rules/admin-select-metadata-rules.component';
import { AdminUserSelectMetadataComponent } from '../admin-metadata-user/admin-user-select-metadata/admin-user-select-metadata.component';
import { AdminSelectMetadataComponent } from '../admin-metadata/admin-select-metadata/admin-select-metadata.component';
import { AdminPredicatesSelectComponent } from '../admin-predicates/admin-predicates-select/admin-predicates-select.component';
import { AdminRelationTypesSelectComponent } from '../admin-relation-types/admin-relation-types-select/admin-relation-types-select.component';
import { AdminUserSelectComponent } from '../admin-user/admin-user-select/admin-user-select.component';

export const TEMPLATE_COMPONENTS: any[] = [
  AdminEnvironmentSelectComponent,
  AdminPredicatesSelectComponent,
  AdminSelectMetadataComponent,
  AdminUserSelectMetadataComponent,
  AdminAttributesSelectComponent,
  AdminClassesSelectComponent,
  AdminFieldsSelectComponent,
  AdminUserSelectComponent,
  AdminRelationTypesSelectComponent,
  AdminSelectMetadataRulesComponent,
  AdminSelectDatasetComponent
];

@Component({
  selector: 'pry-admin-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent extends BaseLayoutComponent implements AfterViewInit, OnDestroy {
  baseToolboxTranslation: string;
  actions$: Observable<BaseToolboxAction[]>;
  subActions$: Observable<BaseToolboxAction[]>;
  compoType$?: Observable<string | null>;
  panelOpen$: Observable<boolean>;
  sub = new Subscription();
  @ViewChild('adminPanel', { static: true, read: ViewContainerRef }) adminPanel!: ViewContainerRef;
  componentRef?: ComponentRef<any>;
  limit$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(store: Store<any>, router: Router, private route: ActivatedRoute) {
    super(store, router);
    this.baseToolboxTranslation = '@pry.admin.';
    this.actions$ = this.store.select(AdminSelectors.actions);
    this.subActions$ = this.store.select(AdminSelectors.subActions);
    this.panelOpen$ = this.store.select(AdminSelectors.panelOpen);
    this.sub.add(
      this.store.select(AdminSelectors.componentType).subscribe((ct) => {
        this.store.dispatch(AdminActions.togglePanel({ panelOpen: !!ct }));
      })
    );
    this.subscriptions.add(this.route.data.subscribe((data) => this.limit$?.next(data['limitMenu'])));
  }

  override init(): void {
    this.menus$ = this.store.select(AdminSelectors.menus);
    this.menuOpen$ = this.store.select(AdminSelectors.menuOpen);
  }

  override highlightMenu(menu: string): void {
    this.store.dispatch(AdminActions.highlightMenu({ menu }));
  }

  ngAfterViewInit(): void {
    this.compoType$ = this.store.select(AdminSelectors.componentType);
    this.sub.add(
      this.compoType$.subscribe((ct) => {
        if (this.componentRef) {
          this.adminPanel.clear();
        }
        let component = TEMPLATE_COMPONENTS.find((c) => c.id === ct);
        if (component) {
          this.componentRef = this.adminPanel.createComponent(component);
        }
      })
    );
  }

  override ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
