import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';
import { ConfigActions } from '../../../core/store/config/config.actions';
import { ContextMenuActions } from '../../../core/store/context-menu/context-menu.actions';
import { ContextMenuSelectors } from '../../../core/store/context-menu/context-menu.selectors';
import { DashboardActions } from '../../store/dashboard.actions';
import { DashboardSelectors } from '../../store/dashboard.selectors';
import { SubscriptionnerDirective } from '../subscriptionner.directive';
import { WidgetFactoryService } from '../widgets/widget-instanciator/widget-factory.service';

@Component({
  selector: 'pry-context-menu',
  templateUrl: './context-menu.component.html'
})
export class ContextMenuComponent extends SubscriptionnerDirective {
  allowObjectCreation$: Observable<boolean | undefined>;
  opened$: Observable<boolean>;
  position$: Observable<{ clientX: number; clientY: number }>;
  itemId$: Observable<string>;
  itemId?: string;
  isSelected$: Observable<boolean>;
  resultSet: string | undefined;
  selectedIds$: Observable<string[]>;
  selectedItemsIds?: string[];
  from?: string;
  coordinates?: number[];
  private overlayRef?: OverlayRef;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  private overlayDetailRef?: OverlayRef;
  @ViewChild('detailTemplate', { read: TemplateRef }) detailTemplate!: TemplateRef<any>;
  detailManifest = {
    type: 'detail',
    header: false,
    layout: { x: 1, y: 1, width: 1, height: 1 },
    options: { itemIds: [] as string[] }
  };
  isModuleLoaded: { [type: string]: boolean } = {};

  constructor(
    private store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    public widgetFactoryService: WidgetFactoryService
  ) {
    super();
    this.allowObjectCreation$ = this.store.select(ContextMenuSelectors.allowObjectCreation);
    this.opened$ = this.store.select(ContextMenuSelectors.opened);
    this.position$ = this.store.select(ContextMenuSelectors.position);
    this.itemId$ = this.store.select(ContextMenuSelectors.itemId);
    this.selectedIds$ = this.store.select(DashboardSelectors.selectedItemIds);
    this.isSelected$ = combineLatest([this.selectedIds$, this.itemId$]).pipe(
      map(([itemIds, itemId]) => itemIds.includes(itemId))
    );

    this.subscriptions.add(this.store.select(ContextMenuSelectors.from).subscribe((from) => (this.from = from)));
    this.subscriptions.add(
      this.store.select(ContextMenuSelectors.coordinates).subscribe((coordinates) => (this.coordinates = coordinates))
    );
    this.subscriptions.add(this.itemId$.subscribe((itemId) => (this.itemId = itemId)));
    this.subscriptions.add(this.selectedIds$.subscribe((itemIds) => (this.selectedItemsIds = itemIds)));
    this.subscriptions.add(
      this.store.select(ContextMenuSelectors.resultSet).subscribe((resultSet) => (this.resultSet = resultSet))
    );

    this.subscriptions.add(
      this.opened$.pipe(withLatestFrom(this.position$)).subscribe(([opened, position]) => {
        if (opened) {
          this.openWithTemplate(position);
        } else {
          this.overlayRef?.dispose();
        }
      })
    );
    this.widgetFactoryService.isModuleLoaded('detail').subscribe((loaded) => (this.isModuleLoaded['detail'] = loaded));
    this.widgetFactoryService.isModuleLoaded('graph').subscribe((loaded) => (this.isModuleLoaded['graph'] = loaded));
  }

  openWithTemplate(position: any) {
    if (this.from !== 'map') {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['m-context-menu'],
          backdropClass: 'backdrop'
        })
      );
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRef.backdropClick().subscribe(() => this.hide());
      const contextMenu = document.querySelector('div.m-context-menu') as HTMLDivElement;
      if (!!contextMenu) {
        contextMenu.style.left =
          Math.max(0, Math.min(window.innerWidth - contextMenu.clientWidth, position.clientX - 10)) + 'px';
        contextMenu.style.top =
          Math.max(0, Math.min(window.innerHeight - contextMenu.clientHeight, position.clientY - 10)) + 'px';
      }
    } else {
      this.hide();
    }
  }

  hide() {
    this.store.dispatch(ContextMenuActions.hide());
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
  }

  selectionAddOrRemove() {
    this.store.dispatch(DashboardActions.select({ id: this.itemId ?? '', cumulative: true }));
    this.hide();
  }

  explore() {
    this.store.dispatch(DashboardActions.explore({ id: this.itemId ?? '' }));
    this.hide();
  }

  proximity() {
    this.store.dispatch(DashboardActions.proximity({ id: this.itemId ?? '', targetResultSet: this.resultSet ?? '' }));
    this.hide();
  }

  detail() {
    this.store.dispatch(DashboardActions.detail({ ids: [this.itemId ?? ''] }));
    this.hide();
  }

  selectionInvert() {
    this.store.dispatch(DashboardActions.invertSelection());
    this.hide();
  }

  flyingDetail() {
    this.detailManifest.options.itemIds = [this.itemId ?? ''];
    this.overlayDetailRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['o-settings__popup'],
        backdropClass: 'backdrop'
      })
    );
    this.overlayDetailRef.attach(new TemplatePortal(this.detailTemplate, this.viewContainerRef));
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-detail' }));
    this.overlayDetailRef.backdropClick().subscribe(() => this.hideDetail());
    this.hide();
  }

  hideDetail() {
    this.overlayDetailRef?.dispose();
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-detail' }));
  }
}
