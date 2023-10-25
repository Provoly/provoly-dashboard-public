import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, Input, NgZone, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardGridLayout,
  DashboardManifest,
  DashboardSelectors,
  DisplayMode,
  GlobalManifest,
  ManifestDescription,
  PryTitleService,
  PryVisibility,
  PryVisibilityType,
  SubscriptionnerDirective,
  ViewMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, debounceTime, map, Observable, take } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'pry-presentation',
  templateUrl: './presentation.component.html'
})
export class PryPresentationComponent extends SubscriptionnerDirective {
  manifests$: Observable<ManifestDescription[]>;
  selectedPresentation$ = new BehaviorSubject<ManifestDescription | null>(null);
  presentation?: ManifestDescription;
  staticManifest$?: Observable<DashboardManifest>;
  selectedMode: ViewMode = ViewMode.CATALOG;
  modalOpened = false;
  @ViewChild('modal', { read: TemplateRef }) template!: TemplateRef<any>;
  @ViewChild('templateModal', { read: TemplateRef }) templateModal!: TemplateRef<any>;
  @ViewChild('openModal') openModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  @ViewChild('submit') submit!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('crossVisibility') crossVisibility!: ElementRef<HTMLButtonElement>;
  @ViewChild('visibilityModal') visibilityModal!: ElementRef;
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
    protected ngZone: NgZone,
    protected titleService: PryTitleService
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
          this.selectedPresentation$.next(presentation.current ?? null);
          this.selectedMode = presentation?.viewMode ?? this.ViewMode.CATALOG;
        }
      })
    );
    this.titleService.changeTitle('@pry.presentation.title');
  }

  closeRestitution() {
    this.selectedPresentation$.next(null);
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
    this.titleService.changeTitle(presentation.name);
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
    this.store.dispatch(DashboardActions.setGridLayout({ layout: DashboardGridLayout.FULL }));
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: DisplayMode.CREATE }));
  }

  edit(presentation: ManifestDescription) {
    this.selectedMode = ViewMode.EDITION;
    this.selectedPresentation$.next(presentation);
    this.titleService.changeTitle(presentation.name);
    this.store.dispatch(DashboardActions.selectPresentation({ presentation, viewMode: ViewMode.EDITION }));
    this.store.dispatch(DashboardActions.fetchStaticManifest({ id: presentation.id }));
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: DisplayMode.EDIT }));
  }

  delete(id: string) {
    this.store.dispatch(DashboardActions.confirmManifestDeletion({ id }));
  }

  default(id: string, name: string) {
    this.store.dispatch(DashboardActions.defaultManifest({ id, name }));
  }

  toggleModal(presentation?: ManifestDescription | null) {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened && presentation) {
      this.selectedPresentation$.next(presentation);
      this.store.dispatch(DashboardActions.selectPresentation({ presentation, viewMode: ViewMode.CATALOG }));
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
      this.selectedPresentation$.next(null);
    }
  }

  changeVisibility(presentation?: ManifestDescription) {
    if (presentation) {
      this.store.dispatch(
        DashboardActions.saveManifest({
          id: presentation.id ?? '',
          name: presentation.name ?? '',
          description: presentation.description ?? '',
          image: presentation.image ?? '',
          visibility: this.visibility
        })
      );
    }
    this.toggleModal(presentation);
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
