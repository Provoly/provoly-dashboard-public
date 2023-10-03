import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Category,
  CategoryActions,
  CategorySelectors,
  Class,
  ConfigActions,
  DEFAULT_CATEGORY_UUID,
  Field,
  FIELD_OPTIONS,
  FieldActions,
  FieldSelectors,
  PryI18nService
} from '@provoly/dashboard';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  Subscription,
  switchMap
} from 'rxjs';
import { v4 as uuid } from 'uuid';
import { noWhitespaceValidator } from '../../../../components/admin.component';
import { AdminActions } from '../../../../store/admin.actions';
import { AdminClassActions } from '../../store/admin-class.actions';

@Component({
  selector: 'pry-admin-attributes-form',
  templateUrl: './admin-attributes-form.component.html'
})
export class AdminAttributesFormComponent implements OnInit, OnDestroy {
  attrForm: UntypedFormGroup;
  sub = new Subscription();
  nameAlreadyExists$?: Observable<boolean>;
  attributeNames?: string[];
  fields$: Observable<Field[]>;
  selectedFieldTypeDescription$?: Observable<string | undefined>;
  fieldTypeDescription = FIELD_OPTIONS;
  categories$: Observable<Category[]>;
  nameAlreadyExists = false;
  isShowedCategory = false;
  catToAdd = {} as Category;

  @Input() selectedClass?: Class;
  @Input() interClass?: Class;
  @Input() selectedAttribute?: Attribute;

  private overlayRef?: OverlayRef;
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;
  private filterCategories$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef,
    private i18nService: PryI18nService
  ) {
    this.store.dispatch(FieldActions.load());
    this.fields$ = this.store.select(FieldSelectors.fields);
    this.store.dispatch(CategoryActions.load());
    this.categories$ = combineLatest([this.store.select(CategorySelectors.categories), this.filterCategories$]).pipe(
      map(([categories, filter]) =>
        categories.filter((cat) => !filter || cat.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()))
      )
    );

    this.attrForm = this.formBuilder.group({
      id: [uuid()],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100), noWhitespaceValidator]],
      description: [{ value: '', disabled: true }],
      field: ['', [Validators.required]],
      category: [DEFAULT_CATEGORY_UUID],
      multiValued: [false]
    });
  }

  ngOnInit(): void {
    this.attributeNames = this.interClass?.attributes.map((attr: Attribute) => attr.name);

    if (this.selectedClass) {
      this.attributeNames = this.selectedClass.attributes.map((attr: Attribute) => attr.name);

      if (this.selectedAttribute) {
        this.attrForm.patchValue({
          id: this.selectedAttribute.id,
          name: this.selectedAttribute.name,
          field: this.selectedAttribute.field,
          category: this.selectedAttribute.category
        });
        this.attrForm.controls['field'].disable();
      }
    }

    if (this.attributeNames) {
      this.nameAlreadyExists$ = combineLatest([
        this.attrForm.get('name')?.valueChanges as Observable<string>,
        of(this.attributeNames)
      ]).pipe(
        map(([value, attributeNames]) => attributeNames.includes(value) && value != this.selectedAttribute?.name)
      );
      this.sub.add(this.nameAlreadyExists$.subscribe((value) => (this.nameAlreadyExists = value)));
    }

    this.selectedFieldTypeDescription$ = this.attrForm.get('field')?.valueChanges.pipe(
      startWith(this.attrForm.get('field')?.value),
      distinctUntilChanged(),
      switchMap((selectedFieldId) => {
        return this.fields$.pipe(
          map((fields) => {
            const fieldDescription = this.fieldTypeDescription.find(
              (fieldType) => fieldType.varType === fields.find((field) => field.id === selectedFieldId)?.type
            );
            return fieldDescription ? this.i18nService.instant(fieldDescription.description) : '';
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  goBack() {
    const redirectPath = this.selectedAttribute ? '../..' : '..';
    const path = this.router.createUrlTree([redirectPath], { relativeTo: this.route });
    this.store.dispatch(AdminActions.routeTo({ path: path.toString() }));
  }

  addAttribute() {
    this.attrForm.patchValue({
      name: this.attrForm.value.name.trim()
    });

    if (this.attrForm.valid) {
      let attrToSave = this.attrForm.getRawValue() as Attribute;
      let path = this.router.createUrlTree(['..'], { relativeTo: this.route });

      if (this.selectedAttribute) {
        path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
      }

      if (this.selectedClass) {
        this.store.dispatch(
          AdminClassActions.saveAttributeForClass({
            classId: this.selectedClass.id,
            attribute: attrToSave,
            route: path.toString()
          })
        );
      } else if (this.interClass) {
        let interAttribute = Object.assign([], this.interClass.attributes);
        let interClassUpdated = Object.assign({}, this.interClass);
        interAttribute.push(attrToSave);
        interClassUpdated.attributes = interAttribute;
        this.store.dispatch(AdminClassActions.saveInterClass({ class: interClassUpdated, route: path.toString() }));
      }
    }
  }

  showCategory() {
    this.isShowedCategory = true;
    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        panelClass: ['o-modal-wrapper'],
        backdropClass: 'backdrop'
      })
    );
    this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
    this.overlayRef.backdropClick().subscribe((_) => this.closeCategory());
    this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
  }

  closeCategory() {
    this.isShowedCategory = false;
    this.catToAdd = {} as Category;
    this.overlayRef?.dispose();
    this.categories$ = this.store.select(CategorySelectors.categories);
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
  }

  search(event: any) {
    this.filterCategories$.next(event.target.value);
  }

  addCategory() {
    this.catToAdd.id = uuid();
    this.store.dispatch(AdminClassActions.saveCategory({ category: this.catToAdd }));
    this.setCategory(this.catToAdd);
  }

  setCategory(cat: Category) {
    this.attrForm.patchValue({
      category: cat.id
    });
    this.closeCategory();
  }
}
