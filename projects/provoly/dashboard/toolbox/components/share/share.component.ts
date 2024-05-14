import { Component, Inject, Optional, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  DataSourceSelectors,
  getCommonDatasourceGroupsForManifest,
  PRY_ACCESS_TOKEN,
  PryBaseAccess
} from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import equal from 'fast-deep-equal/es6';

@Component({
  selector: 'pry-share-pres',
  templateUrl: './share.component.html'
})
export class ShareComponent extends ToolboxActionComponent {
  modalOpened = false;
  overlayRef?: OverlayRef;
  accessRightsByGroup: { [key: string]: string[] } = {};
  @ViewChild('modal', { read: TemplateRef }) template!: TemplateRef<any>;
  allowedShareGroups$: Observable<string[] | null>;
  disableShareButton$ = new BehaviorSubject<boolean>(false);

  constructor(
    store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super(store, access);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((manifest) => {
        this.accessRightsByGroup = manifest?.current?.accessRightsByGroup ?? {};
      })
    );

    this.allowedShareGroups$ = this.store.select(DataSourceSelectors.datasets).pipe(
      map((datasets) => {
        return this.currentManifest && this.currentManifest.datasource.length > 0
          ? getCommonDatasourceGroupsForManifest(this.currentManifest, datasets)
          : null;
      })
    );
  }

  trigger() {
    this.toggleModal();
  }

  toggleModal() {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened && this.currentManifest) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.overlayRef.backdropClick().subscribe(() => this.toggleModal());
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
    } else {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
      this.close();
    }
  }

  validate() {
    this.store.dispatch(
      DashboardActions.saveManifest({
        id: this.currentManifest!.id ?? '',
        name: this.currentManifest!.name ?? '',
        description: this.currentManifest!.description ?? '',
        image: this.currentManifest!.image ?? '',
        accessRightsByGroup: this.accessRightsByGroup
      })
    );
    this.toggleModal();
  }

  updateAccessRights($event: { [key: string]: string[] }) {
    this.accessRightsByGroup = $event;
    this.updateDisableButtonValue();
  }

  updateDisableButtonValue() {
    if (equal(this.accessRightsByGroup, this.currentManifest?.accessRightsByGroup)) {
      this.disableShareButton$.next(true);
    } else {
      if (this.disableShareButton$.getValue()) {
        this.disableShareButton$.next(false);
      }
    }
  }
}
