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
  ViewMode
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-save-view',
  templateUrl: './save-view.component.html'
})
export class SaveViewComponent extends ToolboxActionComponent {
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
  accessGroups: string[] = [];
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;
  saveTypeOpened = false;
  currentManifest?: ManifestDescription;
  isCurrentPresentationModified$: Observable<boolean>;
  isCurrentPresentationOwner$: Observable<boolean>;
  nbPages: number = 0;
  initialNbPages: number = 0;
  hasInitial: boolean = false;
  ViewMode = ViewMode;

  constructor(store: Store, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    super(store);

    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((presentation) => {
        this.currentManifest = presentation.current
          ? JSON.parse(JSON.stringify(presentation.current))
          : ({ name: '', image: '', description: '' } as ManifestDescription);
        this.initialNbPages = presentation.initial?.windows.length ?? 0;
        this.hasInitial = !!presentation.initial;
      })
    );
    this.isCurrentPresentationModified$ = this.store.select(DashboardSelectors.isCurrentPresentationModified);
    this.isCurrentPresentationOwner$ = this.store.select(DashboardSelectors.isCurrentPresentationOwner);
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
        ...this.currentManifest,
        name: this.currentManifest!.name,
        id: v4(),
        description: this.currentManifest!.description,
        image: this.currentManifest!.image,
        groups: this.accessGroups,
        owner: this.currentManifest?.owner,
        metadata: undefined
      };
      if (this.mode == 'directSave') {
        if (this.currentManifest) {
          presentation.id = this.currentManifest.id;
          presentation.groups = this.currentManifest.groups;
        }
      }
      this.store.dispatch(DashboardActions.saveManifest(presentation));
      this.store.dispatch(
        DashboardActions.selectPresentation({
          presentation: presentation as ManifestDescription
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
    this.close();
  }

  changeAccessGroups($event: string[]) {
    this.currentManifest!.groups = $event;
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
      this.currentManifest?.name && 0 < this.currentManifest?.name.length && this.currentManifest?.name.length <= 50
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
        this.firstFocusdirective?.nativeElement.focus();
      }, 10);
    } else {
      this.overlayRefDirectSaveType?.dispose();
      this.overlayRefDirectSaveType = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.directiveSave?.nativeElement.focus();
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
