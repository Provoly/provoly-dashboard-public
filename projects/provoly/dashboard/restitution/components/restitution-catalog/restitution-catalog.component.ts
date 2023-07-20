import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigActions, ConfigSelectors, PryVisibilityType, ViewMode, Widget } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'pry-restitution-catalog',
  templateUrl: './restitution-catalog.component.html'
})
export class PryRestitutionCatalogComponent {
  restitutions$: Observable<Widget[]>;
  search$ = new BehaviorSubject('');
  filteredRestitution$: Observable<Widget[]>;
  @ViewChild('templateModal', { read: TemplateRef, static: false }) templateModal!: TemplateRef<any>;
  @ViewChild('openModal', { read: ElementRef }) openModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('cancelRemove') cancelRemove!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross', { static: false }) cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  private confirmRemoveRef: OverlayRef | undefined;
  selectedItem?: Element | null;
  @Input() modalOpen = false;
  isOverlayOpen = false;
  mode = ViewMode;
  selectedMode: ViewMode = ViewMode.CATALOG;
  selectedRestitution: Widget | null = null;
  restitution?: Widget;
  PryVisibilityType = PryVisibilityType;

  constructor(
    private store: Store,
    protected overlay: Overlay,
    protected viewContainerRef: ViewContainerRef
  ) {
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
  }

  closeRestitution($event: void) {
    this.selectedRestitution = null;
    this.selectMode(this.mode.CATALOG);
  }

  deleteRestitution(restitution: Widget) {
    this.store.dispatch(ConfigActions.deleteRestitution({ id: restitution.id }));
    this.confirmRemoveRef?.dispose();
    this.confirmRemoveRef = undefined;
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
  }

  editRestitution(restitution: Widget) {
    this.selectedRestitution = restitution;
    this.selectMode(ViewMode.EDITION);
  }

  toggleRemoveConfirm($event?: any, restitution?: Widget) {
    if (!this.confirmRemoveRef) {
      this.restitution = restitution;
      this.confirmRemoveRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name + '-modal' }));
      this.confirmRemoveRef?.backdropClick().subscribe(() => this.toggleRemoveConfirm($event, restitution));
      this.confirmRemoveRef?.attach(new TemplatePortal(this.templateModal, this.viewContainerRef));
      setTimeout(() => {
        this.cancelRemove.nativeElement.focus();
      }, 10);
    } else {
      this.confirmRemoveRef.dispose();
      this.confirmRemoveRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
      this.openModal?.nativeElement.focus();
    }
  }

  cancelRemoveConfirm() {
    this.confirmRemoveRef?.dispose();
    this.confirmRemoveRef = undefined;
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name + '-modal' }));
  }

  focusCrossElement() {
    if (this.cross) {
      this.cross?.nativeElement.focus();
    }
  }

  focusValidation() {
    this.confirm.nativeElement.focus();
  }
}
