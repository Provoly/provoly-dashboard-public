import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  canManifestBeMadePublic,
  DashboardActions,
  DashboardSelectors,
  DataSourceSelectors,
  getCommonDatasourceGroupsForManifest,
  ManifestDescription,
  PryVisibilityType
} from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'pry-share-pres',
  templateUrl: './share.component.html'
})
export class ShareComponent extends ToolboxActionComponent {
  presentation?: ManifestDescription;
  modalOpened = false;
  overlayRef?: OverlayRef;
  accessRightsByGroup: { [key: string]: string[] } = {};
  @ViewChild('modal', { read: TemplateRef }) template!: TemplateRef<any>;
  disableShareRadios$: Observable<{ [key in PryVisibilityType]: boolean }>;
  allowedShareGroups$: Observable<string[]>;
  disableShareButton$ = new BehaviorSubject<boolean>(false);

  constructor(
    store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super(store);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((prez) => {
        this.presentation = prez.current;
        this.accessRightsByGroup = prez?.current?.accessRightsByGroup ?? {};
      })
    );

    this.disableShareRadios$ = this.store.select(DataSourceSelectors.datasets).pipe(
      map((datasets) => {
        return {
          [PryVisibilityType.PRIVATE]: false,
          [PryVisibilityType.PUBLIC]: this.presentation ? !canManifestBeMadePublic(this.presentation, datasets) : true,
          [PryVisibilityType.RESTRICTED]: this.presentation
            ? !(
                canManifestBeMadePublic(this.presentation, datasets) ||
                getCommonDatasourceGroupsForManifest(this.presentation, datasets).length > 0
              )
            : true
        };
      })
    );
    this.allowedShareGroups$ = this.store.select(DataSourceSelectors.datasets).pipe(
      map((datasets) => {
        return this.presentation && datasets.length > 0
          ? getCommonDatasourceGroupsForManifest(this.presentation, datasets)
          : [];
      })
    );
  }

  trigger() {
    this.toggleModal();
  }

  toggleModal() {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened && this.presentation) {
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
        id: this.presentation!.id ?? '',
        name: this.presentation!.name ?? '',
        description: this.presentation!.description ?? '',
        image: this.presentation!.image ?? '',
        accessRightsByGroup: this.accessRightsByGroup
      })
    );
    this.toggleModal();
  }

  updateAccessRights($event: { [key: string]: string[] }) {
    this.accessRightsByGroup = $event;
  }

  updateDisableButtonValue() {
    if (Object.keys(this.accessRightsByGroup).length === 0) {
      this.disableShareButton$.next(true);
    } else {
      if (this.disableShareButton$.getValue()) {
        this.disableShareButton$.next(false);
      }
    }
  }
}
