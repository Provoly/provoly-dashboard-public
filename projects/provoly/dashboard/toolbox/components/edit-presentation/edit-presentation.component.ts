import { Component, Inject, Optional, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';
import { Store } from '@ngrx/store';
import { ConfigActions, DashboardActions, PRY_ACCESS_TOKEN, PryBaseAccess } from '@provoly/dashboard';
import { PresentationFormValue } from '../../shared/presentation-form/presentation-form.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'pry-edit-details',
  templateUrl: './edit-presentation.component.html'
})
export class EditPresentationComponent extends ToolboxActionComponent {
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  isModalOpen: boolean = false;
  overlayRef?: OverlayRef;
  formValue?: Partial<PresentationFormValue>;
  isFormValid: boolean = false;

  constructor(
    store: Store<any>,
    @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super(store, access);
  }

  openModal() {
    if (!this.overlayRef) {
      this.isModalOpen = !this.isModalOpen;
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRef.backdropClick().subscribe((_) => this.closeModal());
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
    } else {
      this.closeModal();
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.overlayRef?.dispose();
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
    this.close();
  }

  save() {
    this.store.dispatch(
      DashboardActions.saveManifest({
        id: this.currentManifest!.id,
        ...(this.formValue as Omit<PresentationFormValue, 'theme'>)
      })
    );
  }
}
