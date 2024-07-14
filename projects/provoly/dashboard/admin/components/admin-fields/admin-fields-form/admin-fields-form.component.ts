import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  FIELD_I18N,
  Field,
  FieldActions,
  FieldSelectors,
  FieldType,
  GeometricFieldTypes,
  PryI18nService,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { combineLatest, map, Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { noWhitespaceValidator } from '../../../components/admin.component';
import { AdminActions } from '../../../store/admin.actions';
import { FieldsActions } from '../store/fields.actions';
import { dateFormatOptions } from '@provoly/dashboard/components/data-format';

export const CRS_OPTIONS = [
  { label: 'WGS84 (EPSG:4326)', code: 'EPSG:4326' },
  { label: 'Lambert93 (EPSG: 2154)', code: 'EPSG:2154' }
];

interface FieldForm {
  name: FormControl<string>;
  type: FormControl<FieldType>;
  crs?: FormControl<string | undefined>;
  formatOptions?: FormGroup<FormatOptionsForm>;
}

interface FormatOptionsForm {
  localeFormat?: FormControl<boolean | null>;
  unit?: FormControl<string | null>;
  decimalPrecision?: FormControl<number | null>;
  dateFormat?: FormControl<string | null>;
}

@Component({
  selector: 'pry-admin-fields-form',
  templateUrl: './admin-fields-form.component.html'
})
export class AdminFieldsFormComponent extends SubscriptionnerDirective implements OnInit, OnDestroy {
  @Input() currentField?: Field;

  form: FormGroup<FieldForm>;
  fieldTypes: FieldType[];
  fieldNames$: Observable<string[]>;
  nameAlreadyExists$?: Observable<boolean>;

  dateFormats = Object.keys(dateFormatOptions.value);

  goBackPath: string;
  goBackPathEdit: string;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private i18n: PryI18nService
  ) {
    super();
    this.store.dispatch(FieldActions.load());

    this.fieldNames$ = this.store
      .select(FieldSelectors.fields)
      .pipe(map((fields) => fields.map((field) => field.name.toLowerCase())));

    this.fieldTypes = Object.values(FieldType)
      .filter((type) => type !== FieldType.GEOMETRYCOLLECTION)
      .sort((a, b) => {
        const [labelA, labelB] = [this.i18n.instant(FIELD_I18N.label + a), this.i18n.instant(FIELD_I18N.label + b)];
        return labelA.localeCompare(labelB);
      });

    this.form = new FormGroup<FieldForm>({
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(100), noWhitespaceValidator],
        nonNullable: true
      }),
      type: new FormControl(this.fieldTypes[0], { nonNullable: true }),
      formatOptions: new FormGroup({})
    });

    this.subscriptions.add(this.type?.valueChanges.subscribe((type) => this.setFormatOptionControls(type)));
    this.form.patchValue({ type: this.fieldTypes[0] });

    this.nameAlreadyExists$ = combineLatest([this.name!.valueChanges, this.fieldNames$]).pipe(
      map(([value, fieldNames]) => fieldNames.includes(value.toLowerCase()) && value != this.currentField?.name)
    );
    this.subscriptions.add(
      this.nameAlreadyExists$.subscribe((value) => {
        if (value) {
          this.name?.setErrors({ 'same-name': true });
        }
        return value;
      })
    );

    this.goBackPath = this.router.createUrlTree(['..'], { relativeTo: this.route }).toString();
    this.goBackPathEdit = this.router.createUrlTree(['../..'], { relativeTo: this.route }).toString();
  }

  ngOnInit(): void {
    if (this.currentField) {
      this.form.patchValue({
        name: this.currentField.name,
        type: this.currentField.type
      });
      this.type!.disable();
      if (this.isGeographicType) {
        this.form.addControl<'crs'>(
          'crs',
          new FormControl(this.currentField.crs, { validators: [Validators.required], nonNullable: true })
        );
        this.crs?.disable();
      }
      this.setFormatOptionValues();
    }
    this.subscriptions.add(
      this.type!.valueChanges.subscribe((type) => {
        if (this.isGeographicType) {
          this.form.addControl(
            'crs',
            new FormControl(CRS_OPTIONS[0].code, { validators: [Validators.required], nonNullable: true })
          );
        } else {
          this.form.removeControl('crs');
        }
      })
    );
  }

  get name(): AbstractControl<string> | null {
    return this.form.get('name');
  }

  get type(): AbstractControl<FieldType> | null {
    return this.form.get('type');
  }

  get crs(): AbstractControl<string | undefined> | null {
    return this.form.get('crs');
  }

  get formatOptions(): FormGroup<FormatOptionsForm> | null {
    return this.form.get('formatOptions') as FormGroup<FormatOptionsForm>;
  }

  get decimalPrecision(): AbstractControl | null | undefined {
    return this.form.get('formatOptions')?.get('decimalPrecision');
  }

  get isGeographicType(): boolean {
    return GeometricFieldTypes.includes(this.type?.value as string);
  }

  goBack() {
    this.store.dispatch(AdminActions.routeTo({ path: this.getPath(), params: undefined }));
  }

  getFormValue() {
    return {
      name: this.name!.value,
      type: this.type!.value,
      crs: this.crs?.value,
      unit: this.formatOptions?.value.unit ?? undefined,
      decimalPrecision: this.formatOptions?.value.decimalPrecision ?? undefined,
      localeFormat: this.formatOptions?.value.localeFormat ?? undefined,
      format: this.formatOptions?.value.dateFormat ?? undefined
    };
  }

  submit() {
    this.form.patchValue({
      name: this.name?.value?.trim()
    });
    if (this.form.valid) {
      this.currentField ? this.updateField() : this.saveField();
    }
  }

  saveField() {
    this.store.dispatch(
      FieldsActions.saveField({
        field: { id: uuid(), ...this.getFormValue() },
        route: this.getPath()
      })
    );
  }

  updateField() {
    this.store.dispatch(
      FieldsActions.updateField({
        field: { id: this.currentField!.id, ...this.getFormValue() },
        route: this.getPath()
      })
    );
  }

  setFormatOptionControls(type: FieldType | null) {
    switch (type) {
      case FieldType.INTEGER:
      case FieldType.LONG:
        this.formatOptions?.addControl('localeFormat', new FormControl(true));
        this.formatOptions?.setControl('unit', new FormControl(null));
        this.formatOptions?.removeControl('decimalPrecision');
        this.formatOptions?.removeControl('dateFormat');
        break;
      case FieldType.DECIMAL:
        this.formatOptions?.addControl('localeFormat', new FormControl(true));
        this.formatOptions?.setControl('unit', new FormControl(null));
        this.formatOptions?.setControl('decimalPrecision', new FormControl(2, [Validators.min(0), Validators.max(20)]));
        this.formatOptions?.removeControl('dateFormat');
        break;
      case FieldType.INSTANT:
        this.formatOptions?.removeControl('localeFormat');
        this.formatOptions?.removeControl('unit');
        this.formatOptions?.removeControl('decimalPrecision');
        this.formatOptions?.setControl('dateFormat', new FormControl('DATETIME'));
        break;
      default:
        this.form.setControl('formatOptions', new FormGroup({}));
        break;
    }
  }

  setFormatOptionValues() {
    switch (this.currentField?.type) {
      case FieldType.INTEGER:
      case FieldType.LONG:
        this.formatOptions?.patchValue({
          localeFormat: this.currentField?.localeFormat,
          unit: this.currentField?.unit
        });
        break;
      case FieldType.DECIMAL:
        this.formatOptions?.patchValue({
          localeFormat: this.currentField?.localeFormat,
          unit: this.currentField?.unit,
          decimalPrecision: this.currentField?.decimalPrecision
        });
        break;
      case FieldType.INSTANT:
        this.formatOptions?.patchValue({ dateFormat: this.currentField?.format });
        break;
      default:
        break;
    }
  }

  private getPath() {
    return this.currentField ? this.goBackPathEdit : this.goBackPath;
  }

  protected readonly CRS_OPTIONS = CRS_OPTIONS;
  protected readonly FieldType = FieldType;
  protected readonly FIELD_I18N = FIELD_I18N;
}
