import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Attribute,
  AttributeExtended,
  BaseToolboxAction,
  Category,
  CategoryActions,
  CategorySelectors,
  Class,
  ClassActions,
  ClassSelectors,
  ConfigActions,
  Field,
  FieldActions,
  FieldSelectors,
  PryI18nService
} from '@provoly/dashboard';
import { combineLatest, filter, map, Observable, of, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminClassActions } from '../store/admin-class.actions';
import { AdminClassSelectors } from '../store/admin-class.selectors';

@Component({
  selector: 'pry-admin-classes-view',
  templateUrl: './admin-classes-view.component.html'
})
export class AdminClassesViewComponent implements OnInit, OnDestroy {
  selectedclass$?: Observable<Class>;
  interClass$?: Observable<Class | undefined>;
  attributes$: Observable<Attribute[]> = of([]);
  fields$: Observable<Field[]> = of([]);
  categories$: Observable<Category[]> = of([]);
  attributesExtended$?: Observable<AttributeExtended[]>;
  selectedAttributeId$: Observable<string | undefined>;

  interClass?: Class;

  sub = new Subscription();
  sortActive? = 'name';
  sortDirection? = 'asc';
  selectedClassId = '';
  backPath: string;
  addAttributePath: string;
  openModal$: Observable<boolean>;
  private overlayRef?: OverlayRef;
  @ViewChild('confirmationModal', { read: TemplateRef }) confirmationModal!: TemplateRef<any>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private i18n: PryI18nService
  ) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(FieldActions.load());
    this.store.dispatch(CategoryActions.load());
    this.store.dispatch(AdminClassActions.unselectAttribute());

    this.fields$ = this.store.select(FieldSelectors.fields);
    this.categories$ = this.store.select(CategorySelectors.categories);
    this.selectedAttributeId$ = this.store.select(AdminClassSelectors.selectedAttributeId);
    this.backPath = this.router.createUrlTree(['..'], { relativeTo: this.route }).toString();
    this.addAttributePath = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route }).toString();
    this.openModal$ = this.store.select(AdminClassSelectors.openModal);
  }

  ngOnInit(): void {
    this.interClass$ = this.store.select(AdminClassSelectors.interClass);
    this.sub.add(this.interClass$.subscribe((c) => (this.interClass = c)));
    if (this.interClass) {
      if (this.interClass.attributes.length > 0) {
        this.attributes$ = of(this.interClass.attributes);
        this.attributesExtended$ = this.getAttrExtended();
      }
    } else {
      this.route.params.subscribe((params) => {
        this.selectedClassId = params['id'];
        this.selectedclass$ = this.store.select(ClassSelectors.classById(this.selectedClassId));
        this.attributes$ = this.selectedclass$.pipe(map((selectedClass) => selectedClass.attributes));
        this.attributesExtended$ = this.getAttrExtended();
      });
    }
    this.setClassActions();
    this.sub.add(
      this.openModal$.subscribe((open) => {
        if (open) {
          this.showModal();
        } else {
          this.closeModal();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private getAttrExtended() {
    return combineLatest([this.attributes$, this.fields$, this.categories$]).pipe(
      filter(([attributes, fields, categories]) => fields.length > 0 && categories.length > 0),
      map(([attributes, fields, categories]) => {
        return attributes.map(
          (attr: Attribute) =>
            ({
              ...attr,
              fieldName: fields.find((field) => field.id === attr.field)?.name || this.i18n.instant('@pry.admin.attributes.unknownField'),
              categoryName: attr.category ?
                categories.find((category) => category.id === attr.category)?.name ?? this.i18n.instant('@pry.admin.attributes.unknownCategory')
                : this.i18n.instant('@pry.admin.attributes.noCategory')
            }) as AttributeExtended
        );
      })
    );
  }

  private setClassActions() {
    this.store.dispatch(AdminActions.resetActions());
    let actions = [
      {
        action: AdminClassActions.back({ path: this.backPath }),
        label: 'back',
        icon: 'arrow_back'
      },
      {
        action: AdminActions.routeTo({ path: this.addAttributePath }),
        label: 'addAttribute',
        icon: 'add_column',
        moduleAccess: 'admin',
        pageAccess: 'classes',
        actionAccess: 'write'
      }
    ] as BaseToolboxAction[];

    if (this.interClass) {
      actions.push({
        action: AdminClassActions.openModal(),
        label: 'addClass',
        icon: 'add_column',
        moduleAccess: 'admin',
        pageAccess: 'classes',
        actionAccess: 'write'
      });
    }

    this.store.dispatch(
      AdminActions.mainActions({
        actions: actions
      })
    );
  }

  private setAttributeActions(attrId: string) {
    this.sub.add(
      this.selectedAttributeId$.subscribe((attributeId) => {
        let editPath = this.router.createUrlTree([attributeId, 'edit'], { relativeTo: this.route }).toString();

        this.store.dispatch(
          AdminActions.mainActions({
            actions: [
              {
                action: AdminClassActions.back({ path: this.backPath }),
                label: 'back',
                icon: 'arrow_back'
              },
              {
                action: AdminActions.routeTo({ path: editPath }),
                label: 'edit',
                icon: 'edit',
                moduleAccess: 'admin',
                pageAccess: 'fields',
                actionAccess: 'write'
              },
              {
                action: AdminClassActions.confirmAttributeDeletion({
                  classId: this.selectedClassId,
                  attrId: attrId,
                  backPath: this.backPath,
                  addAttrPath: this.addAttributePath
                }),
                label: 'delete',
                icon: 'delete',
                moduleAccess: 'admin',
                pageAccess: 'classes',
                actionAccess: 'write'
              }
            ]
          })
        );
      })
    );
  }

  selectAttr(attr: AttributeExtended) {
    this.store.dispatch(AdminClassActions.selectAttribute({ attrExtended: attr }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminAttributesSelectComponent' }));
    this.setAttributeActions(attr.id);
    this.store.dispatch(AdminActions.fetchAttributeAssociations({ id: attr.id }));
  }

  dispatchCloseModal() {
    this.store.dispatch(AdminClassActions.closeModal());
  }

  showModal() {
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['o-modal-wrapper'],
        backdropClass: 'backdrop'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRef.backdropClick().subscribe((_) => this.closeModal());
    this.overlayRef.attach(new TemplatePortal(this.confirmationModal, this.viewContainerRef));
  }

  closeModal() {
    this.overlayRef?.dispose();
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
  }

  saveClass() {
    if (this.interClass) {
      this.store.dispatch(AdminClassActions.saveClass({ class: this.interClass, route: this.backPath }));
    }
    this.dispatchCloseModal();
  }
}
