import { Component, EventEmitter, Input, Optional, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardGridLayout,
  DashboardSelectors,
  GlobalManifest,
  IMetadata,
  ManifestDescription, MetadataValue,
  SubscriptionnerDirective,
  ViewMode,
  WidgetPlacementUtils
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, Observable, take } from 'rxjs';
import { MetadataSelectors, MetaEventType } from '@provoly/dashboard/components/metadata-editor';
import { v4 as uuidv4 } from 'uuid';
import { PresentationFormValue } from '@provoly/dashboard/toolbox';

@Component({
  selector: 'pry-add-edit-presentation',
  templateUrl: './add-edit-presentation.component.html'
})
export class PryAddEditPresentationComponent extends SubscriptionnerDirective {
  staticManifest$: Observable<GlobalManifest>;
  selectedPresentation$ = new BehaviorSubject<ManifestDescription | undefined>(undefined);
  chosenLayout: string = DashboardGridLayout.FULL;
  metadataDefs: IMetadata[] | undefined;
  metadataThemeId: string = '';
  formValue?: Partial<PresentationFormValue>;
  isFormValid = false;

  @Input() set selectedPresentation(presentation: ManifestDescription | undefined) {
    this.selectedPresentation$.next(presentation);
  }
  @Input() edition: boolean = false;
  @Input() themePrefix: string | null = null;
  @Input() editionStartUrl: string = '/';
  @Input() mode: 'theme' | 'meta' = 'meta';

  @Output() goBack = new EventEmitter<void>();

  constructor(
    protected store: Store,
    @Optional() protected router: Router
  ) {
    super();
    this.staticManifest$ = this.store.select(DashboardSelectors.staticManifest);
    combineLatest([this.staticManifest$, this.store.select(DashboardSelectors.gridLayout)]).subscribe(
      ([staticManifest, gridLayout]) => {
        this.chosenLayout =
          this.edition && staticManifest.windows[0]?.grid?.layout !== undefined
            ? staticManifest.windows[0]?.grid?.layout
            : gridLayout;
      }
    );
    this.subscriptions.add(
      this.store.select(MetadataSelectors.metadata).subscribe((metadata) => {
        this.metadataDefs = metadata;
        const metadataTheme = metadata?.find((meta) => meta.name === '_theme');
        if (metadataTheme) {
          this.metadataThemeId = metadataTheme?.id ?? '';
        }
      })
    );
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
      ...this.formValue,
      metadata: this.metadata()
    };

    this.subscriptions.add(
      this.staticManifest$.pipe(take(1)).subscribe((staticManifest) => {
        this.store.dispatch(
          DashboardActions.saveManifest({
            ...presentation,
            metadata: presentation.metadata?.map((metadata: MetadataValue) => ({
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
    if (this.isFormValid) {
      this.dispatchSave();
    }

    const presentation = {
      ...this.selectedPresentation$.value!,
      ...this.formValue,
      metadata: this.metadata()
    };

    if (!this.edition) {
      this.store.dispatch(
        DashboardActions.updateManifest({
          manifest: {
            windows: [
              {
                widgets: [],
                grid: {
                  layout: this.chosenLayout,
                  columns: WidgetPlacementUtils.getLayout(this.chosenLayout)?.columns,
                  rows: WidgetPlacementUtils.getLayout(this.chosenLayout)?.rows
                }
              }
            ]
          },
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
          viewMode: ViewMode.CREATION
        })
      );
    } else {
      this.store.dispatch(
        DashboardActions.loadPresentation({
          presentation,
          viewMode: ViewMode.EDITION
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

  metadata(): MetadataValue[] {
    return this.mode === 'theme'
      ? !this.formValue?.theme || this.formValue?.theme === ''
        ? []
        : [
            {
              metadataDef: this.metadataDefs!.find((metadata) => metadata.id === this.metadataThemeId)!,
              value: this.formValue.theme ?? ''
            }
          ]
      : this.selectedPresentation$.value?.metadata ?? [];
  }
}
