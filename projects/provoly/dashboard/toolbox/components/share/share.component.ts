import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardSelectors,
  GlobalManifest,
  ManifestDescription,
  PryVisibility,
  PryVisibilityType,
  ViewMode
} from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'pry-share-pres',
  templateUrl: './share.component.html'
})
export class ShareComponent extends ToolboxActionComponent {
  presentation:
    | {
        current: ManifestDescription | undefined;
        viewMode?: ViewMode;
        initial: GlobalManifest | undefined;
      }
    | undefined;
  modalOpened = false;
  overlayRef?: OverlayRef;
  accessGroups: string[] = [];
  visibility: PryVisibility = { type: PryVisibilityType.PRIVATE };
  @ViewChild('modal', { read: TemplateRef }) template!: TemplateRef<any>;

  constructor(store: Store, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super(store);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((prez) => {
        this.presentation = prez;
        this.accessGroups = prez?.current!.groups;
        this.visibility = prez?.current!.visibility ?? { type: PryVisibilityType.PRIVATE };
      })
    );
  }

  trigger() {
    this.toggleModal();
  }

  toggleModal() {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened && this.presentation) {
      this.store.dispatch(
        DashboardActions.selectPresentation({ presentation: this.presentation.current, viewMode: ViewMode.CATALOG })
      );
      /* we need to load manifest in order to be able to save it later */
      this.store.dispatch(DashboardActions.loadManifest({ id: this.presentation.current!.id }));
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

  changeVisibility() {
    if (this.presentation) {
      this.store.dispatch(
        DashboardActions.saveManifest({
          id: this.presentation.current!.id ?? '',
          name: this.presentation.current!.name ?? '',
          description: this.presentation.current!.description ?? '',
          image: this.presentation.current!.image ?? '',
          groups: this.accessGroups,
          visibility: this.visibility
        })
      );
    }
    this.toggleModal();
  }
}
