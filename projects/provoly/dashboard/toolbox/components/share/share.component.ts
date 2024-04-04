import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  canManifestBeMadePublic,
  DashboardActions,
  DashboardSelectors,
  DataSourceSelectors,
  getCommonDatasourceGroupsForManifest,
  ManifestDescription,
  PryVisibilityType
} from '@provoly/dashboard';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'pry-share-pres',
  templateUrl: './share.component.html'
})
export class ShareComponent extends ToolboxActionComponent {
  presentation?: ManifestDescription;
  modalOpened = false;
  overlayRef?: OverlayRef;
  accessGroups: string[] = [];
  @ViewChild('modal', { read: TemplateRef }) template!: TemplateRef<any>;
  disableShareRadios$: Observable<{ [key in PryVisibilityType]: boolean }>;
  allowedShareGroups$: Observable<string[]>;
  shareRadioValue$ = new BehaviorSubject<PryVisibilityType | undefined>(undefined);
  disableShareButton$ = new BehaviorSubject<boolean>(false);

  constructor(
    store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super(store);
    this.subscriptions.add(
      this.store.select(DashboardSelectors.presentation).subscribe((prez) => {
        this.presentation = prez.current;
        this.accessGroups = prez?.current?.groups ?? [];
      })
    );

    this.disableShareRadios$ = this.store.select(DataSourceSelectors.datasets).pipe(
      map((datasets) => {
        return {
          [PryVisibilityType.PRIVATE]: false,
          [PryVisibilityType.PUBLIC]: this.presentation ? !canManifestBeMadePublic(this.presentation, datasets) : true,
          [PryVisibilityType.RESTRICTED]: this.presentation
            ? !(
                canManifestBeMadePublic(this.presentation, datasets) ||
                getCommonDatasourceGroupsForManifest(this.presentation, datasets).length > 0
              )
            : true
        };
      })
    );
    this.allowedShareGroups$ = this.store.select(DataSourceSelectors.datasets).pipe(
      map((datasets) => {
        return this.presentation ? getCommonDatasourceGroupsForManifest(this.presentation, datasets) : [];
      })
    );
  }

  trigger() {
    this.toggleModal();
  }

  toggleModal() {
    this.modalOpened = !this.modalOpened;
    if (this.modalOpened && this.presentation) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.overlayRef.backdropClick().subscribe(() => this.toggleModal());
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
    } else {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
      this.close();
    }
  }

  validate() {
    this.store.dispatch(
      DashboardActions.saveManifest({
        id: this.presentation!.id ?? '',
        name: this.presentation!.name ?? '',
        description: this.presentation!.description ?? '',
        image: this.presentation!.image ?? '',
        groups: this.accessGroups
      })
    );
    this.toggleModal();
  }

  updateAccessGroups($event: string[]) {
    this.accessGroups = $event;
    this.updateDisableButtonValue();
  }

  updateVisibility($event: PryVisibilityType) {
    this.shareRadioValue$.next($event);
    this.updateDisableButtonValue();
  }

  updateDisableButtonValue() {
    if (this.shareRadioValue$.getValue() === PryVisibilityType.RESTRICTED && this.accessGroups.length === 0) {
      this.disableShareButton$.next(true);
    } else {
      if (this.disableShareButton$.getValue()) {
        this.disableShareButton$.next(false);
      }
    }
  }
}
