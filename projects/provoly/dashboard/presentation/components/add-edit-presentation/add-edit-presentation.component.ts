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
import { combineLatest, debounceTime, Observable, take } from 'rxjs';
import { MetadataActions, MetaEventType } from '@provoly/dashboard/components/metadata-editor';

@Component({
  selector: 'pry-add-edit-presentation',
  templateUrl: './add-edit-presentation.component.html'
})
export class PryAddEditPresentationComponent extends SubscriptionnerDirective implements OnInit, AfterViewInit {
  staticManifest$: Observable<GlobalManifest>;
  @Input() selectedPresentation!: ManifestDescription;
  @Input() edition: boolean = false;
  @Input() editionStartUrl: string = '/';
  form!: FormGroup;
  image: string = DEFAULT_RESTITUTION_ICON_URL;
  @Output() goBack = new EventEmitter<void>();
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;
  chosenLayout?: string;

  constructor(private store: Store, @Optional() protected router: Router) {
    super();
    this.store.dispatch(MetadataActions.loadMetadata());
    this.store.dispatch(DashboardActions.setGridLayout({ layout: DashboardGridLayout.FULL }));
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
    this.image = this.selectedPresentation?.image ?? DEFAULT_RESTITUTION_ICON_URL;
  }

  ngAfterViewInit() {
    if (this.selectedPresentation) {
      setTimeout(() => {
        this.form.patchValue(this.selectedPresentation);
      });
    }
  }

  save() {
    const presentation = {
      ...this.selectedPresentation!,
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
            manifest: staticManifest
          })
        );
      })
    );
    this.store.dispatch(
      DashboardActions.selectPresentation({
        presentation: presentation,
        viewMode: ViewMode.EDITION
      })
    );
  }

  configureDashboard(selectedPresentation: ManifestDescription) {
    this.store.dispatch(
      DashboardActions.selectPresentation({
        presentation: {
          ...this.selectedPresentation!,
          name: this.form.value.name ?? '',
          description: this.form.value.description ?? '',
          image: this.image ?? DEFAULT_RESTITUTION_ICON_URL,
          cover: this.form.value.cover ?? false
        },
        viewMode: this.edition ? ViewMode.CREATION : ViewMode.EDITION
      })
    );
    if (!this.edition) {
      this.store.dispatch(
        DashboardActions.updateManifest({
          // @ts-ignore
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
      this.router?.navigateByUrl(this.editionStartUrl);
    } else {
      this.store
        .select(DashboardSelectors.staticManifest)
        .pipe(debounceTime(1000), take(1))
        .subscribe((staticManifest: GlobalManifest) => {
          this.store.dispatch(
            DashboardActions.updateManifest({
              manifest: staticManifest,
              selectedIds: [],
              manifestId: selectedPresentation.id
            })
          );
          this.store.dispatch(
            DashboardActions.setInitialPresentation({
              initial: staticManifest
            })
          );
          this.store.dispatch(DashboardActions.followManifestRoute());
          this.router?.navigateByUrl(this.editionStartUrl);
        });
    }
  }

  addMetadata(metadata: MetaEventType) {
    this.store.dispatch(
      DashboardActions.addManifestMetadata({
        presentationId: this.selectedPresentation.id,
        metadataId: metadata.metadataId,
        value: metadata.value ?? ''
      })
    );
  }

  removeMetadata(metadata: MetaEventType) {
    this.store.dispatch(
      DashboardActions.deleteManifestMetadata({
        presentationId: this.selectedPresentation.id,
        metadataId: metadata.metadataId
      })
    );
  }

  close() {
    this.goBack.emit();
  }
}
