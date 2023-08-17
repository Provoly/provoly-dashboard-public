import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  WidgetPlacementUtils
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-select-grid-layout',
  templateUrl: './select-grid-layout.component.html'
})
export class SelectGridLayoutComponent extends ToolboxActionComponent {
  availableLayouts$: Observable<{ translation: any; value: any; image: string }[]>;
  chosenLayout: DashboardGridLayout = DashboardGridLayout.MANUAL;
  canDispatch = false;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  @ViewChild('firstButton') firstButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') openModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  modalOpened: boolean = false;
  overlayRef?: OverlayRef;

  constructor(store: Store, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super(store);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.gridLayout).subscribe((layout) => (this.chosenLayout = layout))
    );
    this.availableLayouts$ = this.store.select(DashboardSelectors.windowManifest).pipe(
      map((manifest) =>
        WidgetPlacementUtils.getLayouts()
          .filter((layout) => {
            return WidgetPlacementUtils.placesForLayout(layout.key) >= (manifest.widgets ?? []).length;
          })
          .map((layout) => ({
            value: layout.key,
            translation: '@pry.toolbox.layout.' + layout.key,
            image: layout.image
          }))
      )
    );

    setTimeout(() => {
      this.canDispatch = true;
    }, 100);
  }

  changeLayout(layout: DashboardGridLayout) {
    this.chosenLayout = layout;
  }

  toggleGridChoiceModal() {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened) {
      this.openWithTemplate();
    } else {
      this.overlayRef?.dispose();
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.openModal.nativeElement.focus();
    }
  }

  openWithTemplate() {
    if (!this.overlayRef) {
      this.modalOpened = !this.modalOpened;
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper', 'o-select-grid-layout-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRef.backdropClick().subscribe((_) => this.toggleGridChoiceModal());
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
      setTimeout(() => {
        this.firstButton.nativeElement.focus();
      }, 10);
    } else {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.openModal.nativeElement.focus();
      this.modalOpened = !this.modalOpened;
    }
  }

  validate() {
    if (this.canDispatch) {
      this.store.dispatch(DashboardActions.setGridLayout({ layout: this.chosenLayout }));
    }
    this.toggleGridChoiceModal();
  }

  focusCrossElement() {
    this.cross.nativeElement.focus();
  }

  focusValidation() {
    this.confirm.nativeElement.focus();
  }
}
