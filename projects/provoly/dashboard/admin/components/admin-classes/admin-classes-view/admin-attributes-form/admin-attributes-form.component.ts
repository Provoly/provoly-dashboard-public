import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Category,
  CategoryActions,
  CategorySelectors,
  Class,
  DEFAULT_CATEGORY_UUID,
  Field,
  FIELD_I18N,
  FieldActions,
  FieldSelectors,
  PryDialogService,
  PryI18nService,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { combineLatest, debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { noWhitespaceValidator } from '../../../../components/admin.component';
import { AdminActions } from '../../../../store/admin.actions';
import { AdminClassActions } from '../../store/admin-class.actions';
import { AddCategoryModalComponent } from '../../../shared/add-category-modal/add-category-modal.component';

@Component({
  selector: 'pry-admin-attributes-form',
  templateUrl: './admin-attributes-form.component.html'
})
export class AdminAttributesFormComponent extends SubscriptionnerDirective implements OnInit, OnDestroy {
  attrForm: UntypedFormGroup;

  attributeNames?: string[];
  attributeTechnicalNames?: string[];
  nameAlreadyExists$?: Observable<boolean>;
  technicalNameAlreadyExists$?: Observable<boolean>;
  nameAlreadyExists = false;
  technicalNameAlreadyExists = false;

  fields$: Observable<Field[]>;
  selectedFieldTypeDescription$!: Observable<string>;
  categories$: Observable<Category[]>;

  @Input() selectedClass?: Class;
  @Input() interClass?: Class;
  @Input() selectedAttribute?: Attribute;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private i18nService: PryI18nService,
    private dialog: PryDialogService
  ) {
    super();
    this.store.dispatch(FieldActions.load());
    this.fields$ = this.store.select(FieldSelectors.fields);
    this.store.dispatch(CategoryActions.load());
    this.categories$ = this.store.select(CategorySelectors.categories);

    this.attrForm = this.formBuilder.group({
      id: [uuid()],
      technicalName: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(100), noWhitespaceValidator]
      ],
      name: ['', [Validators.maxLength(50), noWhitespaceValidator]],
      description: [{ value: '', disabled: true }],
      field: ['', [Validators.required]],
      category: [DEFAULT_CATEGORY_UUID],
      multiValued: [false]
    });
  }

  ngOnInit(): void {
    this.attributeNames = this.interClass?.attributes.map((attr: Attribute) => attr.name);
    this.attributeTechnicalNames = this.interClass?.attributes.map((attr: Attribute) => attr.technicalName);

    if (this.selectedClass) {
      this.attributeNames = this.selectedClass.attributes.map((attr: Attribute) => attr.name);
      this.attributeTechnicalNames = this.selectedClass.attributes.map((attr: Attribute) => attr.technicalName);

      if (this.selectedAttribute) {
        this.attrForm.patchValue({
          id: this.selectedAttribute.id,
          technicalName: this.selectedAttribute.technicalName,
          name: this.selectedAttribute.name ?? this.selectedAttribute.technicalName,
          field: this.selectedAttribute.field,
          category: this.selectedAttribute.category
        });
        this.attrForm.controls['field'].disable();
      }
    }

    if (this.attributeNames) {
      this.nameAlreadyExists$ = this.attrForm
        .get('name')!
        .valueChanges.pipe(
          map((value) => !!this.attributeNames?.includes(value) && value != this.selectedAttribute?.name)
        );
      this.subscriptions.add(this.nameAlreadyExists$.subscribe((value) => (this.nameAlreadyExists = value)));
    }

    this.subscriptions.add(
      this.attrForm
        .get('technicalName')!
        .valueChanges.pipe(distinctUntilChanged(), debounceTime(500))
        .subscribe((value) => {
          this.attrForm.patchValue({
            name: value.slice(0, 50)
          });
        })
    );

    if (this.attributeTechnicalNames) {
      this.technicalNameAlreadyExists$ = this.attrForm
        .get('technicalName')!
        .valueChanges.pipe(
          map(
            (value) => !!this.attributeTechnicalNames?.includes(value) && value != this.selectedAttribute?.technicalName
          )
        );
      this.subscriptions.add(
        this.technicalNameAlreadyExists$.subscribe((value) => {
          this.technicalNameAlreadyExists = value;
        })
      );
    }

    this.selectedFieldTypeDescription$ = combineLatest([
      this.attrForm.get('field')!.valueChanges.pipe(startWith(this.attrForm.get('field')?.value)),
      this.fields$
    ]).pipe(
      map(([selectedFieldId, fields]) =>
        !selectedFieldId
          ? ''
          : FIELD_I18N.information +
            fields.find(
              (field) => field.id === (typeof selectedFieldId === 'string' ? selectedFieldId : selectedFieldId.id)
            )?.type
      )
    );
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

    if (!this.attrForm.value.name) {
      this.attrForm.patchValue({
        name: this.attrForm.value.technicalName.slice(0, 50)
      });
    }

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
        let interClassUpdated = { ...this.interClass };
        interAttribute.push(attrToSave);
        interClassUpdated.attributes = interAttribute;
        this.store.dispatch(AdminClassActions.saveInterClass({ class: interClassUpdated, route: path.toString() }));
      }
    }
  }

  openModal() {
    const ref = this.dialog.open(AddCategoryModalComponent);
    ref.component!.entityType = 'attribute';
    this.subscriptions.add(
      ref.component!.category.subscribe((category) => {
        this.attrForm.patchValue({
          category: category.id
        });
      })
    );
    this.subscriptions.add(ref.component!.closeModal.subscribe(() => ref.close()));
  }

  protected readonly FIELD_I18N = FIELD_I18N;
}
