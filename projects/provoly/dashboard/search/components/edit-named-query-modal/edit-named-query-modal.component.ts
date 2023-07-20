import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigActions, DataSourceActions, DataSourceSelectors, SubscriptionnerDirective } from '@provoly/dashboard';

@Component({
  selector: 'pry-edit-named-query-modal',
  templateUrl: './edit-named-query-modal.component.html'
})
export class EditNamedQueryModalComponent extends SubscriptionnerDirective {
  private overlayRef?: OverlayRef;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  constructor(
    private store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super();

    this.subscriptions.add(
      this.store.select(DataSourceSelectors.editInProgress).subscribe((inProgress) => {
        if (inProgress && !this.overlayRef && !this.isPanelAlreadyPresent) {
          // open modal
          this.overlayRef = this.overlay.create(
            new OverlayConfig({
              hasBackdrop: true,
              panelClass: ['o-edit-named-query-modal'],
              backdropClass: 'backdrop'
            })
          );
          this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
          this.overlayRef.backdropClick().subscribe((_) => {
            this.close();
          });
          this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
        }
        if (!inProgress) {
          this.close();
        }
      })
    );
  }

  close() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
    this.store.dispatch(DataSourceActions.namedQuery.stopEdit());
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
  }

  get isPanelAlreadyPresent() {
    return (
      document.getElementsByTagName('pry-search-home').length +
        document.getElementsByTagName('pry-search-tools').length >
      0
    );
  }
}
