import { AfterViewInit, Component, ComponentRef, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseLayoutComponent, BaseToolboxAction } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { SupervisionIntegrationErrorsSelectComponent } from '../../../supervision/components/supervision-integration-errors/supervision-integration-errors-select/supervision-integration-errors-select.component';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';

@Component({
  selector: 'pry-supervision-layout',
  templateUrl: './supervision-layout.component.html'
})
export class SupervisionLayoutComponent extends BaseLayoutComponent implements AfterViewInit, OnDestroy {
  baseToolboxTranslation: string;
  actions$: Observable<BaseToolboxAction[]>;
  subActions$: Observable<BaseToolboxAction[]>;
  panelOpen$: Observable<boolean>;
  @ViewChild('supervisionPanel', { static: true, read: ViewContainerRef }) supervisionPanel!: ViewContainerRef;
  componentRef?: ComponentRef<any>;

  constructor(store: Store<any>, router: Router) {
    super(store, router);
    this.baseToolboxTranslation = '@pry.supervision.';
    this.actions$ = this.store.select(SupervisionSelectors.actions);
    this.subActions$ = this.store.select(SupervisionSelectors.subActions);
    this.panelOpen$ = this.store.select(SupervisionSelectors.errorDetailsOpen);
  }

  override init(): void {
    this.menus$ = this.store.select(SupervisionSelectors.menus);
    this.menuOpen$ = this.store.select(SupervisionSelectors.menuOpen);
  }

  override highlightMenu(menu: string): void {
    this.store.dispatch(SupervisionActions.highLightMenu({ menu }));
  }

  ngAfterViewInit(): void {
    if (this.componentRef) {
      this.supervisionPanel.clear();
    }
    this.componentRef = this.supervisionPanel.createComponent(SupervisionIntegrationErrorsSelectComponent);
  }

  override ngOnDestroy() {
    this.store.dispatch(SupervisionActions.toggleErrorDetails({ error: undefined, errorDetailsOpen: false }));
  }
}
