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
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  ManifestDescription,
  PRY_ACCESS_TOKEN,
  PryAccessRightsShareModalComponent,
  PryBaseAccess,
  PryDialogService,
  PryTitleService,
  SubscriptionnerDirective,
  ViewMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith } from 'rxjs';
import { v4 } from 'uuid';

interface ManifestDescriptionWithTheme extends ManifestDescription {
  theme: string | undefined;
}

@Component({
  selector: 'pry-presentation',
  templateUrl: './presentation.component.html'
})
export class PryPresentationComponent extends SubscriptionnerDirective {
  manifests$: Observable<ManifestDescriptionWithTheme[]>;
  search$ = new BehaviorSubject('');
  filteredPresentations$: Observable<ManifestDescriptionWithTheme[]>;

  selectedPresentation$ = new BehaviorSubject<ManifestDescription | undefined>(undefined);
  selectedMode: ViewMode = ViewMode.CATALOG;
  ViewMode = ViewMode;

  @ViewChild('modalActions', { read: TemplateRef }) templateModalActions!: TemplateRef<any>;
  @ViewChild('openModal') openModal!: ElementRef<HTMLButtonElement>;
  overlayRef?: OverlayRef;

  @Input() editionStartUrl: string = '/';
  @Input() consultStartUrl: string = '/';
  @Input() meAsOwner?: string;
  @Input() themePrefix: string | null = null;
  @Input() mode: 'theme' | 'meta' = 'meta';
  @Input() hideToolbox = false;
  @Input() showTheme = true;

  listOfManifests$ = new BehaviorSubject<ManifestDescription[] | null>(null);
  @Input() set listOfManifests(manifests: ManifestDescription[] | null) {
    this.listOfManifests$.next(Array.isArray(manifests) ? manifests : null);
  }

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
    @Optional() @Inject(PRY_ACCESS_TOKEN) private access: PryBaseAccess,
    private dialog: PryDialogService
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
    ]).pipe(
      map(([dynamics, statics]) => statics ?? dynamics),
      map((manifests) =>
        manifests.map(
          (manifest) =>
            ({
              ...manifest,
              theme: manifest.metadata?.find((meta) => meta.metadataDef.name === '_theme')?.value
            }) as ManifestDescriptionWithTheme
        )
      )
    );

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
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((presentation) => {
        this.selectedMode = presentation?.viewMode ?? this.ViewMode.CATALOG;
        this.selectedPresentation$.next(presentation.current);
      })
    );
    this.titleService.changeTitle('@pry.presentation.title');
  }

  closeRestitution() {
    this.selectedPresentation$.next(undefined);
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
      this.selectedPresentation$.next(undefined);
    }
  }

  toggleModal(presentation?: ManifestDescription | null) {
    if (presentation) {
      this.selectedPresentation$.next(presentation);
      this.store.dispatch(DashboardActions.selectPresentation({ presentation, viewMode: ViewMode.CATALOG }));
      this.toggleModalActions();
      this.dialog.open(PryAccessRightsShareModalComponent, {
        hasBackdrop: true,
        panelClass: ['o-modal-wrapper'],
        backdropClass: 'backdrop',
        data: { manifest: presentation }
      });
    }
  }

  editContent(selectedPresentation: ManifestDescription) {
    this.store.dispatch(
      DashboardActions.loadPresentation({ presentation: selectedPresentation, viewMode: ViewMode.EDITION })
    );
    this.ngZone.run(() => {
      this.router?.navigateByUrl(this.consultStartUrl);
    });
  }

  isPrivate(presentation: ManifestDescription) {
    return Object.keys(presentation.accessRightsByGroup).length === 0;
  }

  canModify$(presentation: ManifestDescription) {
    return !this.access ? of(false) : this.access.canModifyPresentation(presentation);
  }
}
