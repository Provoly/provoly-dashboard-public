import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, Input, NgZone, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  DashboardActions,
  DashboardManifest,
  DashboardSelectors,
  GlobalManifest,
  ManifestDescription,
  PryVisibility,
  PryVisibilityType,
  SubscriptionnerDirective,
  ViewMode,
  DisplayMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, take } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'pry-presentation',
  templateUrl: './presentation.component.html'
})
export class PryPresentationComponent extends SubscriptionnerDirective {
  manifests$: Observable<ManifestDescription[]>;
  selectedPresentation: ManifestDescription | null = null;
  presentation?: ManifestDescription;
  staticManifest$?: Observable<DashboardManifest>;
  selectedMode: ViewMode = ViewMode.CATALOG;
  modalOpened = false;
  @ViewChild('modal', { read: TemplateRef }) template!: TemplateRef<any>;
  @ViewChild('templateModal', { read: TemplateRef }) templateModal!: TemplateRef<any>;
  @ViewChild('openModal') openModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('cancelRemove') cancelRemove!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  @ViewChild('submit') submit!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('crossVisibility') crossVisibility!: ElementRef<HTMLButtonElement>;
  @ViewChild('visibilityModal') visibilityModal!: ElementRef;
  @ViewChild('deleteModal') deleteModal!: ElementRef;
  private confirmRemoveRef?: OverlayRef;
  overlayRef?: OverlayRef;
  visibility: PryVisibility = { type: PryVisibilityType.PRIVATE };
  PryVisibilityType = PryVisibilityType;
  @Input() editionStartUrl: string = '/';
  @Input() consultStartUrl: string = '/';
  @Input() meAsOwner?: string;
  ViewMode = ViewMode;
  search$ = new BehaviorSubject('');
  filteredPresentations$: Observable<ManifestDescription[]>;

  constructor(
    protected store: Store<any>,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
    protected router: Router,
    protected ngZone: NgZone
  ) {
    super();
    this.store.dispatch(DashboardActions.fetchManifestsList());
    this.manifests$ = this.store
      .select(DashboardSelectors.manifestsList)
      .pipe(
        map((manifestList) =>
          [...manifestList].sort((a, b) =>
            a.modificationDate ? b.modificationDate.localeCompare(a.modificationDate) : 1
          )
        )
      );
    this.staticManifest$ = this.store
      .select(DashboardSelectors.staticManifest)
      .pipe(map((staticM) => staticM.windows[0]));
    this.filteredPresentations$ = combineLatest([this.manifests$, this.search$]).pipe(
      map(([presentations, search]) =>
        presentations.filter(
          (presentations) =>
            search.length === 0 ||
            presentations.description.toLowerCase().includes(search.toLowerCase()) ||
            presentations.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((presentation) => {
        if (!!presentation.current) {
          this.selectedPresentation = presentation.current ?? null;
          this.selectedMode = presentation?.viewMode ?? this.ViewMode.CATALOG;
        }
      })
    );
  }

  closeRestitution() {
    this.selectedPresentation = null;
    this.selectedMode = ViewMode.CATALOG;
    this.store.dispatch(DashboardActions.selectPresentation({ presentation: undefined, viewMode: ViewMode.CATALOG }));
  }

  fetch(presentation: ManifestDescription) {
    this.store.dispatch(
      DashboardActions.updateManifest({
        manifest: { windows: [] },
        selectedIds: []
      })
    );
    this.store.dispatch(
      DashboardActions.selectPresentation({
        presentation: presentation,
        viewMode: ViewMode.CATALOG
      })
    );
    this.store.dispatch(DashboardActions.fetchStaticManifest({ id: presentation.id }));
    this.store
      .select(DashboardSelectors.staticManifest)
      .pipe(debounceTime(1000), take(1))
      .subscribe((staticManifest: GlobalManifest) => {
        this.store.dispatch(
          DashboardActions.updateManifest({
            manifest: staticManifest,
            selectedIds: [],
            manifestId: presentation.id
          })
        );
        this.store.dispatch(
          DashboardActions.setInitialPresentation({
            initial: staticManifest
          })
        );
      });
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: DisplayMode.CONSULT }));
    this.store.dispatch(DashboardActions.followManifestRoute());
    this.ngZone.run(() => {
      this.router?.navigateByUrl(this.consultStartUrl);
    });
  }

  creation() {
    this.selectedMode = ViewMode.CREATION;
    this.store.dispatch(DashboardActions.updateManifest({ manifest: { windows: [] }, selectedIds: [] }));
    const newPresentation = {
      presentation: {
        id: v4(),
        name: '',
        description: '',
        visibility: { type: PryVisibilityType.PRIVATE },
        owner: true
      } as ManifestDescription,
      viewMode: ViewMode.CREATION
    };
    this.store.dispatch(DashboardActions.selectPresentation(newPresentation));
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: DisplayMode.CREATE }));
  }

  edit(presentation: ManifestDescription) {
    this.selectedMode = ViewMode.EDITION;
    this.selectedPresentation = presentation;
    this.store.dispatch(
      DashboardActions.selectPresentation({ presentation: this.selectedPresentation, viewMode: ViewMode.EDITION })
    );
    this.store.dispatch(DashboardActions.fetchStaticManifest({ id: presentation.id }));
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: DisplayMode.EDIT }));
  }

  delete(id: string) {
    this.store.dispatch(DashboardActions.deleteManifest({ id }));
    this.confirmRemoveRef?.dispose();
    this.confirmRemoveRef = undefined;
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
  }

  default(id: string, name: string) {
    this.store.dispatch(DashboardActions.defaultManifest({ id, name }));
  }

  toggleModal(presentation?: ManifestDescription | null) {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened && presentation) {
      this.selectedPresentation = presentation;
      this.store.dispatch(
        DashboardActions.selectPresentation({ presentation: this.selectedPresentation, viewMode: ViewMode.CATALOG })
      );
      /* we need to load manifest in order to be able to save it later */
      this.store.dispatch(DashboardActions.loadManifest({ id: presentation.id }));
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.overlayRef.backdropClick().subscribe(() => this.toggleModal(presentation));
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
      setTimeout(() => {
        const focus = this.visibilityModal.nativeElement.children[0].children[1].firstElementChild as HTMLButtonElement;
        focus.focus();
      }, 10);
    } else {
      this.overlayRef?.dispose();
      this.selectedPresentation = null;
    }
  }

  changeVisibility() {
    if (this.selectedPresentation) {
      this.store.dispatch(
        DashboardActions.saveManifest({
          id: this.selectedPresentation.id ?? '',
          name: this.selectedPresentation.name ?? '',
          description: this.selectedPresentation.description ?? '',
          image: this.selectedPresentation.image ?? '',
          visibility: this.visibility
        })
      );
    }
    this.toggleModal(this.selectedPresentation);
  }

  toggleRemoveConfirm($event: any, presentation?: ManifestDescription) {
    if (!this.confirmRemoveRef) {
      this.presentation = presentation;
      this.confirmRemoveRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-modal' }));
      this.confirmRemoveRef.backdropClick().subscribe(() => this.toggleRemoveConfirm($event, presentation));
      this.confirmRemoveRef.attach(new TemplatePortal(this.templateModal, this.viewContainerRef));
      setTimeout(() => {
        const focus = this.deleteModal.nativeElement.children[0].children[1].firstElementChild as HTMLButtonElement;
        focus.focus();
      }, 10);
    } else {
      this.confirmRemoveRef.dispose();
      this.confirmRemoveRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
      this.openModal.nativeElement.focus();
    }
  }

  cancelRemoveConfirm() {
    this.confirmRemoveRef?.dispose();
    this.confirmRemoveRef = undefined;
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
  }

  focusCrossElement() {
    if (this.crossVisibility) {
      this.crossVisibility?.nativeElement.focus();
    }
    this.cross?.nativeElement.focus();
  }

  focusValidation() {
    if (this.confirm) {
      this.confirm.nativeElement.focus();
    }
    this.submit.nativeElement.focus();
  }
}
