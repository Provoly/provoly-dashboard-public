import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  ConfigSelectors, DashboardActions,
  ManifestDescription,
  PryVisibilityType,
  ViewMode,
  Widget
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { TemplatePortal } from "@angular/cdk/portal";

@Component({
  selector: 'pry-restitution-catalog',
  templateUrl: './restitution-catalog.component.html'
})
export class PryRestitutionCatalogComponent {
  restitutions$: Observable<Widget[]>;
  search$ = new BehaviorSubject('');
  filteredRestitution$: Observable<Widget[]>;
  mode = ViewMode;
  selectedMode: ViewMode = ViewMode.CATALOG;
  selectedRestitution: Widget | null = null;
  restitution?: Widget;
  PryVisibilityType = PryVisibilityType;
  overlayRef?: OverlayRef;
  @ViewChild('modalActions', { read: TemplateRef }) templateActions!: TemplateRef<any>;

  constructor(private store: Store, protected overlay: Overlay, protected viewContainerRef: ViewContainerRef) {
    this.store.dispatch(ConfigActions.loadWidgets());
    this.store.dispatch(ConfigActions.getMapStyles());

    this.restitutions$ = this.store
      .select(ConfigSelectors.catalog)
      .pipe(
        map((restitutionList) =>
          [...restitutionList].sort((a, b) =>
            a.modificationDate ? b.modificationDate.localeCompare(a.modificationDate) : 1
          )
        )
      );
    this.filteredRestitution$ = combineLatest([this.restitutions$, this.search$]).pipe(
      map(([restitutions, search]) =>
        restitutions.filter(
          (restitution) => search.length === 0 || restitution.name.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }

  selectMode(newMode: ViewMode) {
    this.selectedMode = newMode;
  }

  selectRestitution(restitution: Widget) {
    this.selectedRestitution = restitution;
    this.selectMode(this.mode.CONSULT);
    this.search$.next('');
  }

  closeRestitution($event: void) {
    this.selectedRestitution = null;
    this.selectMode(this.mode.CATALOG);
  }

  deleteRestitution(id: string) {
    this.store.dispatch(ConfigActions.confirmRestitutionDeletion({ id }));
    this.toggleModalActions()
  }

  editRestitution(restitution: Widget) {
    this.selectedRestitution = restitution;
    this.selectMode(ViewMode.EDITION);
    this.search$.next('');
    this.overlayRef?.dispose();
    this.overlayRef = undefined
  }

  toggleModalActions(restitution?: Widget ) {
    if (!this.overlayRef && restitution){
      this.selectedRestitution = restitution
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.overlayRef.backdropClick().subscribe(() => this.toggleModalActions(restitution));
      this.overlayRef.attach(new TemplatePortal(this.templateActions, this.viewContainerRef));
    } else {
      this.overlayRef?.dispose();
      this.overlayRef = undefined
      this.selectedRestitution = null;
    }
  }

}
