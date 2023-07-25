import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  DashboardActions,
  DashboardSelectors,
  LibraryTypes,
  ManifestDescription,
  PryVisibility,
  PryVisibilityType,
  SubscriptionnerDirective,
  ViewMode
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'pry-save-view',
  templateUrl: './save-view.component.html'
})
export class SaveViewComponent extends SubscriptionnerDirective {
  @Input() label = true;
  @Input() mode: 'saveAs' | 'directSave' = 'saveAs';
  @ViewChild('input') input!: ElementRef;
  @ViewChild('saveAs') saveAs!: ElementRef<HTMLButtonElement>;
  @ViewChild('directiveSave') directiveSave!: ElementRef<HTMLButtonElement>;
  @ViewChild('firstFocusdirective') firstFocusdirective!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  @ViewChild('cancel') cancel!: ElementRef<HTMLButtonElement>;
  saveAsOpened: boolean = false;
  overlayRefSaveAs?: OverlayRef;
  @ViewChild('templateSaveAs', { read: TemplateRef }) templateSaveAs!: TemplateRef<any>;
  overlayRefDirectSaveType?: OverlayRef;
  @ViewChild('templateDirectSaveType', { read: TemplateRef }) templateDirectSaveType!: TemplateRef<any>;
  visibility: PryVisibility = { type: PryVisibilityType.PRIVATE };
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;
  saveTypeOpened = false;
  currentManifest?: ManifestDescription;
  savePresentationActive$: Observable<boolean>;
  nbPages: number = 0;
  initialNbPages: number = 0;
  hasInitial: boolean = false;
  ViewMode = ViewMode;

  constructor(
    private store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super();

    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((presentation) => {
        this.currentManifest = presentation.current
          ? JSON.parse(JSON.stringify(presentation.current))
          : ({ name: '', image: '', description: '', cover: false } as ManifestDescription);
        this.initialNbPages = presentation.initial?.windows.length ?? 0;
        this.hasInitial = !!presentation.initial;
      })
    );
    this.savePresentationActive$ = this.store.select(DashboardSelectors.savePresentationActive);
    this.subscriptions.add(
      this.store
        .select(DashboardSelectors.globalManifest)
        .subscribe((manifest) => (this.nbPages = manifest.windows.length))
    );
  }

  toggleSaveAs() {
    this.saveAsOpened = !this.saveAsOpened;
    if (this.saveAsOpened) {
      this.store.dispatch(DashboardActions.requestAllRoutes());
      this.openSaveAs();
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 10);
    } else {
      this.overlayRefSaveAs?.dispose();
      this.overlayRefSaveAs = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.saveAs.nativeElement.focus();
    }
  }

  save() {
    this.store.dispatch(DashboardActions.requestAllRoutes());

    // Give time for routes to be updated
    setTimeout(() => {
      let presentation = {
        name: this.currentManifest!.name,
        id: v4(),
        description: this.currentManifest!.description,
        image: this.currentManifest!.image,
        visibility: this.visibility,
        cover: this.currentManifest?.cover ?? false
      };
      if (this.mode == 'directSave') {
        if (this.currentManifest) {
          presentation.id = this.currentManifest.id;
          presentation.visibility = this.currentManifest.visibility;
        }
      }
      this.store.dispatch(DashboardActions.saveManifest(presentation));
      this.store.dispatch(
        DashboardActions.selectPresentation({
          presentation: presentation as ManifestDescription,
          viewMode: ViewMode.CATALOG
        })
      );
      this.mode = 'directSave';
    }, 200);
    this.overlayRefSaveAs?.dispose();
    this.closeModals();
  }

  closeModals() {
    if (this.saveTypeOpened) {
      this.toggleDirectSaveType();
    }
    if (this.saveAsOpened) {
      this.toggleSaveAs();
    }
  }

  changeVisibility($event: PryVisibility) {
    this.currentManifest!.visibility = $event;
  }

  changeValue($event: string) {
    this.currentManifest!.name = $event;
  }

  changeDescr($event: string) {
    this.currentManifest!.description = $event;
  }

  openSaveAs() {
    this.overlayRefSaveAs = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['o-modal-wrapper'],
        backdropClass: 'backdrop'
      })
    );
    this.mode = 'saveAs';
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRefSaveAs.backdropClick().subscribe((_) => this.toggleSaveAs());
    this.overlayRefSaveAs.attach(new TemplatePortal(this.templateSaveAs, this.viewContainerRef));
  }

  isValid() {
    return (
      this.currentManifest?.name && 0 < this.currentManifest?.name.length && this.currentManifest?.name.length <= 30
    );
  }

  toggleDirectSaveType() {
    this.saveTypeOpened = !this.saveTypeOpened;
    if (this.saveTypeOpened) {
      this.store.dispatch(DashboardActions.requestAllRoutes());
      this.overlayRefDirectSaveType = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRefDirectSaveType.backdropClick().subscribe((_) => this.toggleDirectSaveType());
      this.overlayRefDirectSaveType.attach(new TemplatePortal(this.templateDirectSaveType, this.viewContainerRef));
      setTimeout(() => {
        this.firstFocusdirective.nativeElement.focus();
      }, 10);
    } else {
      this.overlayRefDirectSaveType?.dispose();
      this.overlayRefDirectSaveType = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.directiveSave.nativeElement.focus();
    }
  }

  get mustOpenModal() {
    return this.hasInitial && this.nbPages !== this.initialNbPages;
  }

  directSave() {
    if (this.mustOpenModal) {
      this.toggleDirectSaveType();
    } else {
      this.save();
    }
  }

  restore() {
    this.store.dispatch(DashboardActions.restoreInitialManifest());
    this.closeModals();
  }

  focusCrossElement() {
    this.cross.nativeElement.focus();
  }

  focusValidation() {
    if (!this.currentManifest?.name) {
      this.cancel.nativeElement.focus();
    }
    this.confirm.nativeElement.focus();
  }

  rename() {
    this.toggleSaveAs();
  }

  disableNextStep() {
    if (!this.currentManifest?.name) {
      this.focusCrossElement();
    }
  }
}
