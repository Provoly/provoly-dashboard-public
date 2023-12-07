import { AfterViewInit, Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  DEFAULT_RESTITUTION_ICON_URL,
  GlobalManifest,
  LibraryTypes,
  ManifestDescription,
  SubscriptionnerDirective,
  ViewMode
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, Observable, take } from 'rxjs';
import { MetadataActions, MetaEventType } from '@provoly/dashboard/components/metadata-editor';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'pry-add-edit-presentation',
  templateUrl: './add-edit-presentation.component.html'
})
export class PryAddEditPresentationComponent extends SubscriptionnerDirective implements OnInit, AfterViewInit {
  staticManifest$: Observable<GlobalManifest>;
  selectedPresentation$ = new BehaviorSubject<ManifestDescription | null>(null);
  @Input() edition: boolean = false;
  @Input() editionStartUrl: string = '/';
  form!: FormGroup;
  image: string = DEFAULT_RESTITUTION_ICON_URL;
  @Output() goBack = new EventEmitter<void>();
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;
  chosenLayout: DashboardGridLayout = DashboardGridLayout.FULL;

  @Input() set selectedPresentation(presentation: ManifestDescription | null) {
    this.selectedPresentation$.next(presentation);
  }

  constructor(protected store: Store, @Optional() protected router: Router) {
    super();
    this.store.dispatch(MetadataActions.loadMetadata());
    this.staticManifest$ = this.store.select(DashboardSelectors.staticManifest);
    combineLatest([this.staticManifest$, this.store.select(DashboardSelectors.gridLayout)]).subscribe(
      ([staticManifest, gridLayout]) => {
        this.chosenLayout =
          this.edition && staticManifest.windows[0]?.grid?.layout !== undefined
            ? staticManifest.windows[0]?.grid?.layout
            : gridLayout;
      }
    );
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      description: new FormControl(null, [Validators.maxLength(200)]),
      cover: new FormControl(false)
    });
    this.image = this.selectedPresentation$.value?.image ?? DEFAULT_RESTITUTION_ICON_URL;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.selectedPresentation$.value) this.form.patchValue(this.selectedPresentation$.value);
    });
  }

  save() {
    if (!this.edition) {
      this.store.dispatch(DashboardActions.updateStaticManifest({ staticManifest: { windows: [] } }));
    }
    const presentation = this.dispatchSave();
    this.store.dispatch(
      DashboardActions.selectPresentation({
        presentation,
        viewMode: ViewMode.EDITION
      })
    );
  }

  dispatchSave(): ManifestDescription {
    const presentation = {
      ...this.selectedPresentation$.value!,
      id: this.selectedPresentation$.value?.id || uuidv4(),
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      cover: this.form.value.cover ?? false,
      image: this.image ?? DEFAULT_RESTITUTION_ICON_URL
    };

    this.subscriptions.add(
      this.staticManifest$.pipe(take(1)).subscribe((staticManifest) => {
        this.store.dispatch(
          DashboardActions.saveManifest({
            ...presentation,
            metadata: presentation.metadata?.map((metadata) => ({
              metadataDefId: metadata.metadataDef.id,
              value: metadata.value
            })),
            manifest: staticManifest
          })
        );
      })
    );
    return presentation;
  }

  configureDashboard(selectedPresentation: ManifestDescription) {
    if (this.form.valid) {
      this.dispatchSave();
    }

    const presentation = {
      ...this.selectedPresentation$.value!,
      name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      image: this.image ?? DEFAULT_RESTITUTION_ICON_URL,
      cover: this.form.value.cover ?? false
    };

    if (!this.edition) {
      this.store.dispatch(
        DashboardActions.updateManifest({
          manifest: { windows: [{ widgets: [], grid: { layout: this.chosenLayout } }] },
          selectedIds: [],
          manifestId: selectedPresentation.id
        })
      );
      this.store.dispatch(
        DashboardActions.setInitialPresentation({
          initial: { windows: [{ widgets: [], grid: { layout: this.chosenLayout as DashboardGridLayout } }] }
        })
      );
      this.store.dispatch(
        DashboardActions.selectPresentation({
          presentation,
          viewMode: this.edition ? ViewMode.CREATION : ViewMode.EDITION
        })
      );
    } else {
      this.store.dispatch(
        DashboardActions.loadPresentation({
          presentation,
          viewMode: this.edition ? ViewMode.CREATION : ViewMode.EDITION
        })
      );
    }
    this.router?.navigateByUrl(this.editionStartUrl);
  }

  addMetadata(metadata: MetaEventType) {
    this.store.dispatch(
      DashboardActions.addManifestMetadata({
        presentationId: this.selectedPresentation$.value?.id!,
        metadataId: metadata.metadataId,
        value: metadata.value ?? ''
      })
    );
  }

  removeMetadata(metadata: MetaEventType) {
    this.store.dispatch(
      DashboardActions.deleteManifestMetadata({
        presentationId: this.selectedPresentation$.value?.id!,
        metadataId: metadata.metadataId
      })
    );
  }

  close() {
    this.goBack.emit();
  }
}
