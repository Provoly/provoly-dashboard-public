import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Optional,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  canManifestBeMadePublic,
  DashboardActions,
  DashboardGridLayout,
  DashboardManifest,
  DashboardSelectors,
  DataSourceSelectors,
  getCommonDatasourceGroupsForManifest,
  ManifestDescription,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  PryTitleService,
  PryVisibilityType,
  SubscriptionnerDirective,
  ViewMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith } from 'rxjs';
import { v4 } from 'uuid';

@Component({
  selector: 'pry-presentation',
  templateUrl: './presentation.component.html'
})
export class PryPresentationComponent extends SubscriptionnerDirective {
  manifests$: Observable<ManifestDescription[]>;
  selectedPresentation$ = new BehaviorSubject<ManifestDescription | null>(null);
  staticManifest$?: Observable<DashboardManifest>;
  selectedMode: ViewMode = ViewMode.CATALOG;
  modalOpened = false;
  @ViewChild('modalActions', { read: TemplateRef }) templateModalActions!: TemplateRef<any>;
  @ViewChild('modal', { read: TemplateRef }) template!: TemplateRef<any>;
  @ViewChild('openModal') openModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  @ViewChild('submit') submit!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('crossVisibility') crossVisibility!: ElementRef<HTMLButtonElement>;
  @ViewChild('visibilityModal') visibilityModal!: ElementRef;
  overlayRef?: OverlayRef;
  accessRightsByGroup: { [key: string]: string[] } = {};
  @Input() editionStartUrl: string = '/';
  @Input() consultStartUrl: string = '/';
  @Input() meAsOwner?: string;
  ViewMode = ViewMode;
  search$ = new BehaviorSubject('');
  filteredPresentations$: Observable<ManifestDescription[]>;
  listOfManifests$ = new BehaviorSubject<ManifestDescription[] | null>(null);
  allowedShareGroups$: Observable<string[]>;
  disableShareButton$ = new BehaviorSubject<boolean>(false);

  @Input() mode: 'theme' | 'meta' = 'meta';

  @Input() set listOfManifests(manifests: ManifestDescription[] | null) {
    this.listOfManifests$.next(Array.isArray(manifests) ? manifests : null);
  }

  @Input() hideToolbox = false;
  inputSearch$ = new BehaviorSubject('');

  @Input() set search(query: string) {
    this.inputSearch$.next(query);
  }

  constructor(
    protected store: Store<any>,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef,
    protected router: Router,
    protected titleService: PryTitleService,
    protected activatedRoute: ActivatedRoute,
    protected ngZone: NgZone,
    @Optional() @Inject(PRY_ACCESS_TOKEN) private access: PryBaseAccess
  ) {
    super();
    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params['create']) {
          this.creation();
        }
      })
    );
    this.store.dispatch(DashboardActions.fetchManifestsList());
    this.manifests$ = combineLatest([
      this.store
        .select(DashboardSelectors.manifestsList)
        .pipe(
          map((manifestList) =>
            [...manifestList].sort((a, b) =>
              a.modificationDate ? b.modificationDate.localeCompare(a.modificationDate) : 1
            )
          )
        ),
      this.listOfManifests$
    ]).pipe(map(([dynamics, statics]) => statics ?? dynamics));

    this.staticManifest$ = this.store
      .select(DashboardSelectors.staticManifest)
      .pipe(map((staticM) => staticM.windows[0]));
    this.filteredPresentations$ = combineLatest([
      this.manifests$,
      this.search$,
      this.inputSearch$.pipe(startWith(''))
    ]).pipe(
      map(([presentations, search, inputSearch]) =>
        presentations.filter((presentations) => {
          const [name, description] = [presentations.name.toLowerCase(), presentations.description?.toLowerCase()];
          const [searchQuery, inputSearchQuery] = [search?.toLowerCase(), inputSearch?.toLowerCase()];
          return !!searchQuery || !!inputSearchQuery
            ? (!!searchQuery && (name.includes(searchQuery) || description?.includes(searchQuery))) ||
                (!!inputSearchQuery && (name.includes(inputSearchQuery) || description?.includes(inputSearchQuery)))
            : true;
        })
      )
    );
    this.allowedShareGroups$ = combineLatest([
      this.selectedPresentation$,
      this.store.select(DataSourceSelectors.datasets)
    ]).pipe(
      map(([presentation, datasets]) => {
        return presentation && datasets.length > 0 ? getCommonDatasourceGroupsForManifest(presentation, datasets) : [];
      })
    );
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((presentation) => {
        this.selectedMode = presentation?.viewMode ?? this.ViewMode.CATALOG;
        this.selectedPresentation$.next(presentation.current ?? null);
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
    this.store.dispatch(DashboardActions.loadPresentation({ presentation, viewMode: ViewMode.CONSULT }));
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
        accessRightsByGroup: {} as { [key: string]: string[] },
        owner: true
      } as ManifestDescription,
      viewMode: ViewMode.CREATION
    };
    this.store.dispatch(DashboardActions.selectPresentation(newPresentation));
    this.store.dispatch(DashboardActions.setGridLayout({ layout: DashboardGridLayout.FULL }));
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: ViewMode.CREATION }));
  }

  edit(presentation: ManifestDescription) {
    this.selectedMode = ViewMode.EDITION;
    this.selectedPresentation$.next(presentation);
    this.titleService.changeTitle(presentation.name);
    this.store.dispatch(DashboardActions.selectPresentation({ presentation, viewMode: ViewMode.EDITION }));
    this.store.dispatch(DashboardActions.fetchStaticManifest({ id: presentation.id }));
    this.store.dispatch(DashboardActions.updateDisplayOptions({ mode: ViewMode.EDITION }));
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  delete(id: string) {
    this.store.dispatch(DashboardActions.confirmManifestDeletion({ id }));
    this.toggleModalActions();
  }

  toggleModalActions(presentation?: ManifestDescription | null, moreButton?: HTMLButtonElement) {
    if (!this.overlayRef && presentation) {
      this.selectedPresentation$.next(presentation);
      this.store.dispatch(DashboardActions.selectPresentation({ presentation, viewMode: ViewMode.CATALOG }));
      this.store.dispatch(DashboardActions.loadManifest({ id: presentation.id }));
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['m-context-menu-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.overlayRef.backdropClick().subscribe(() => this.toggleModalActions(presentation));
      this.overlayRef.attach(new TemplatePortal(this.templateModalActions, this.viewContainerRef));
      const contextMenu = document.querySelector('div.m-context-menu') as HTMLDivElement;
      if (!!contextMenu && moreButton) {
        const rect = moreButton.getBoundingClientRect();
        contextMenu.style.minWidth = '185px';
        contextMenu.style.left = (rect?.left ?? 0) - (contextMenu?.clientWidth ?? 0) + 23 + 'px';
        contextMenu.style.top = (rect?.top ?? 0) + 30 + 'px';
      }
    } else {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
      this.selectedPresentation$.next(null);
    }
  }

  toggleModal(presentation?: ManifestDescription | null) {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened && presentation) {
      this.toggleModalActions();
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
      this.overlayRef = undefined;
    }
  }

  changeVisibility(presentation?: ManifestDescription) {
    if (presentation) {
      this.store.dispatch(
        DashboardActions.saveManifest({
          id: presentation.id ?? '',
          name: presentation.name ?? '',
          description: presentation.description,
          image: presentation.image ?? '',
          accessRightsByGroup: this.accessRightsByGroup
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

  editContent(selectedPresentation: ManifestDescription) {
    this.store.dispatch(
      DashboardActions.loadPresentation({ presentation: selectedPresentation, viewMode: ViewMode.EDITION })
    );
    this.ngZone.run(() => {
      this.router?.navigateByUrl(this.consultStartUrl);
    });
  }

  updateAccessRights($event: { [key: string]: string[] }) {
    this.accessRightsByGroup = $event;
    this.updateDisableButtonValue();
  }

  updateVisibility($event: PryVisibilityType) {
    this.updateDisableButtonValue();
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

  isPrivate(presentation: ManifestDescription) {
    return Object.keys(presentation.accessRightsByGroup).length === 0;
  }

  canModify$(presentation: ManifestDescription) {
    return !this.access ? of(false) : this.access.canModifyPresentation(presentation);
  }
}
