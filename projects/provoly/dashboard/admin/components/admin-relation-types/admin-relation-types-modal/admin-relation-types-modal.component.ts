import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfigActions, RelationType, RelationTypesActions, RelationTypesSelectors } from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'pry-admin-relation-types-modal',
  templateUrl: './admin-relation-types-modal.component.html'
})
export class AdminRelationTypesModalComponent implements OnInit, OnDestroy {
  openModal$: Observable<boolean>;
  nameAlreadyExists$?: Observable<boolean>;
  selectedRelationType$: Observable<RelationType | undefined>;
  relationTypesNames$: Observable<string[]>;

  selectedRelationType?: RelationType;
  relationTypeForm: UntypedFormGroup;
  sub = new Subscription();
  nameAlreadyExists = false;
  isSubmitted = false;

  private overlayRef?: OverlayRef;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  constructor(
    private store: Store<AdminRelationTypesModalComponent>,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private formBuilder: UntypedFormBuilder
  ) {
    this.openModal$ = this.store.select(RelationTypesSelectors.openModal);
    this.relationTypesNames$ = this.store
      .select(RelationTypesSelectors.relationsTypes)
      .pipe(map((links) => links.map((l) => l.name.toLowerCase())));
    this.selectedRelationType$ = this.store.select(RelationTypesSelectors.selectedRelationType);

    this.relationTypeForm = this.formBuilder.group({
      id: [uuid()],
      name: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  ngOnInit(): void {
    this.sub.add(
      this.openModal$.subscribe((open) => {
        if (open) {
          this.showModal();
        } else {
          this.closeModal();
        }
      })
    );

    this.nameAlreadyExists$ = combineLatest([
      this.relationTypeForm.get('name')?.valueChanges as Observable<string>,
      this.relationTypesNames$
    ]).pipe(map(([value, lNames]) => lNames.includes(value.toLowerCase())));

    this.sub.add(this.nameAlreadyExists$.subscribe((value) => (this.nameAlreadyExists = value)));

    this.sub.add(
      this.selectedRelationType$.subscribe((rt) => {
        this.selectedRelationType = rt;
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  showModal() {
    if (this.selectedRelationType) {
      this.relationTypeForm.patchValue({
        id: this.selectedRelationType.id,
        name: this.selectedRelationType.name
      });
    } else {
      this.relationTypeForm.patchValue({
        id: uuid(),
        name: ''
      });
    }
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['o-modal-wrapper'],
        backdropClass: 'backdrop'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRef.backdropClick().subscribe((_) => this.closeModal());
    this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
  }

  closeModal() {
    this.overlayRef?.dispose();
    this.store.dispatch(RelationTypesActions.closeModal());
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
  }

  addRelationType() {
    this.isSubmitted = true;
    if (this.relationTypeForm.valid && !this.nameAlreadyExists) {
      this.store.dispatch(
        RelationTypesActions.saveRelationType({
          id: this.relationTypeForm.value.id,
          name: this.relationTypeForm.value.name
        })
      );
      this.closeModal();
    }
  }
}
