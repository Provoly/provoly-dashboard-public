import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Field,
  FIELD_OPTIONS,
  FieldActions,
  FieldSelectors,
  GeometricFieldTypes,
  PryI18nService
} from '@provoly/dashboard';
import { combineLatest, map, Observable, startWith, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { noWhitespaceValidator } from '../../../components/admin.component';
import { AdminActions } from '../../../store/admin.actions';
import { FieldsActions } from '../store/fields.actions';
import { distinctUntilChanged } from 'rxjs/operators';

export const CRS_OPTIONS = [
  { label: 'WGS84 (EPSG:4326)', code: 'EPSG:4326' },
  { label: 'Lambert93 (EPSG: 2154)', code: 'EPSG:2154' }
];

@Component({
  selector: 'pry-admin-fields-form',
  templateUrl: './admin-fields-form.component.html'
})
export class AdminFieldsFormComponent implements OnInit, OnDestroy {
  fieldNames$?: Observable<string[]>;
  nameAlreadyExists$?: Observable<boolean>;
  sub = new Subscription();

  fieldForm: UntypedFormGroup;
  goBackPath: string;
  goBackPathEdit: string;
  isSubmitted = false;
  fieldTypeTranslations: { [key: string]: string }[] = [];
  selectedFieldTypeDescription$?: Observable<string>;
  @Input() currentField?: Field;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private i18nService: PryI18nService
  ) {
    this.fieldTypeTranslations = FIELD_OPTIONS.map((translate) => ({
      varType: translate.varType,
      translation: this.i18nService.instant(translate.translation),
      description: this.i18nService.instant(translate.description)
    }));
    this.fieldTypeTranslations.sort((a, b) => a['translation'].localeCompare(b['translation']));
    this.store.dispatch(FieldActions.load());
    this.goBackPath = this.router.createUrlTree(['..'], { relativeTo: this.route }).toString();
    this.goBackPathEdit = this.router.createUrlTree(['../..'], { relativeTo: this.route }).toString();
    this.fieldForm = this.formBuilder.group({
      id: [uuid()],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noWhitespaceValidator]],
      type: [this.fieldTypeTranslations[0]['varType']]
    });
  }

  ngOnInit(): void {
    this.fieldNames$ = this.store
      .select(FieldSelectors.fields)
      .pipe(map((fields: Field[]) => fields.map((field: Field) => field.name.toLowerCase())));

    this.nameAlreadyExists$ = combineLatest([
      this.fieldForm.get('name')?.valueChanges as Observable<string>,
      this.fieldNames$
    ]).pipe(map(([value, fieldNames]) => fieldNames.includes(value.toLowerCase()) && value != this.currentField?.name));
    this.sub.add(
      this.nameAlreadyExists$.subscribe((value) => {
        if (value) {
          this.fieldForm.controls['name'].setErrors({ 'same-name': true });
        }
        return value;
      })
    );

    if (this.currentField) {
      this.fieldForm.patchValue({
        id: this.currentField.id,
        name: this.currentField.name,
        type: this.currentField.type
      });
      this.fieldForm.controls['type'].disable();
    }
    // @ts-ignore
    this.selectedFieldTypeDescription$ = this.fieldForm.get('type').valueChanges.pipe(
      startWith(this.fieldTypeTranslations[0]['varType']),
      distinctUntilChanged(),
      map(
        (selectedType: string) =>
          this.fieldTypeTranslations.find((translation) => translation['varType'] === selectedType)?.['description'] ??
          ''
      )
    );

    this.fieldForm.get('type')!.valueChanges.subscribe((type) => {
      if (this.isGeographicType) {
        this.fieldForm.addControl('crs', new FormControl(CRS_OPTIONS[0].code, [Validators.required]));
      } else {
        this.fieldForm.removeControl('crs');
      }
    });
  }

  get isGeographicType() {
    return GeometricFieldTypes.includes(this.fieldForm.get('type')?.value);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    this.store.dispatch(AdminActions.routeTo({ path: this.getPath(), params: undefined }));
  }

  addField() {
    this.fieldForm.patchValue({
      name: this.fieldForm.value.name.trim()
    });
    this.isSubmitted = true;
    if (this.fieldForm.valid) {
      this.isSubmitted = false;
      let fieldToSave = this.fieldForm.getRawValue() as Field;
      this.store.dispatch(FieldsActions.saveField({ field: fieldToSave, route: this.getPath() }));
    }
  }

  private getPath() {
    return this.currentField ? this.goBackPathEdit : this.goBackPath;
  }

  protected readonly CRS_OPTIONS = CRS_OPTIONS;
}
