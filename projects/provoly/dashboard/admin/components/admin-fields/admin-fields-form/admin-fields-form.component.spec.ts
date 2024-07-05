import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  FieldType,
  PRY_ACCESS_GUARD,
  PryDefaultAccessGuard,
  PryI18nService,
  PrySelectModule
} from '@provoly/dashboard';
import { field } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { FieldsActions } from '../store/fields.actions';
import { AdminFieldsFormComponent } from './admin-fields-form.component';
import { MockPryI18nService } from '../../../../mock/service/mock-i18n.service';
import { MockPryCheckboxComponent } from '../../../../mock/components/mock-pry-checkbox.component';
import { DEFAULT_DATE_FORMAT } from '@provoly/dashboard/components/data-format';

describe('AdminFieldsFormComponent', () => {
  let component: AdminFieldsFormComponent;
  let fixture: ComponentFixture<AdminFieldsFormComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFieldsFormComponent, MockTranslatePipe, MockI18nPipe, MockPryCheckboxComponent],
      providers: [
        { provide: PryI18nService, useClass: MockPryI18nService },
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({})
      ],
      imports: [PrySelectModule, FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFieldsFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
  });

  describe('set form field values correctly if currentField is provided', () => {
    it('type INTEGER', () => {
      component.currentField = {
        id: 'id',
        name: 'my-field',
        type: FieldType.INTEGER,
        unit: 'unit',
        isLocaleFormat: true
      };
      component.ngOnInit();
      expect(component.form.getRawValue()).toEqual({
        name: 'my-field',
        type: FieldType.INTEGER,
        formatOptions: { unit: 'unit', isLocaleFormat: true }
      });
    });
    it('type DECIMAL', () => {
      component.currentField = {
        id: 'id',
        name: 'my-field',
        type: FieldType.DECIMAL,
        unit: 'unit',
        decimalPrecision: 2,
        isLocaleFormat: true
      };
      component.ngOnInit();
      expect(component.form.getRawValue()).toEqual({
        name: 'my-field',
        type: FieldType.DECIMAL,
        formatOptions: { unit: 'unit', decimalPrecision: 2, isLocaleFormat: true }
      });
    });
    it('type INSTANT', () => {
      component.currentField = {
        id: 'id',
        name: 'my-field',
        type: FieldType.INSTANT,
        format: 'format'
      };
      component.ngOnInit();
      expect(component.form.getRawValue()).toEqual({
        name: 'my-field',
        type: FieldType.INSTANT,
        formatOptions: { dateFormat: 'format' }
      });
    });
  });

  it('should create new field', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');

    component.form.patchValue(field);
    component.submit();

    expect(component.form.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([
      [FieldsActions.saveField({ field: { ...field, id: 'uuiduuid-this-isis-mock-eduuiduuidaa' }, route: '/' })]
    ]);
  }));

  it('should update current field', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.form.patchValue(field);
    component.currentField = field;

    component.currentField.name = 'toto';
    component.form.patchValue({ name: 'toto' });
    component.submit();

    expect(component.form.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[FieldsActions.updateField({ field: component.currentField, route: '/' })]]);
  }));

  it('should not update current field because name is required', fakeAsync(() => {
    component.form.patchValue(field);
    component.form.patchValue({ name: '' });
    component.submit();
    expect(component.form.valid).toEqual(false);
  }));

  describe('format options should be correctly set based on field type', () => {
    it('should set default format options for INTEGER field type', () => {
      component.form.patchValue({ type: FieldType.INTEGER });

      expect(component.formatOptions).toBeTruthy();
      expect(component.formatOptions?.get('dateFormat')).toBeFalsy();
      expect(component.formatOptions?.get('unit')).toBeTruthy();
      expect(component.formatOptions?.get('isLocaleFormat')).toBeTruthy();
      expect(component.formatOptions?.get('decimalPrecision')).toBeFalsy();
      expect(component.formatOptions?.value).toEqual({ isLocaleFormat: true, unit: null });
    });
    it('should set default format options for LONG field type', () => {
      component.form.patchValue({ type: FieldType.LONG });

      expect(component.formatOptions).toBeTruthy();
      expect(component.formatOptions?.get('dateFormat')).toBeFalsy();
      expect(component.formatOptions?.get('unit')).toBeTruthy();
      expect(component.formatOptions?.get('isLocaleFormat')).toBeTruthy();
      expect(component.formatOptions?.get('decimalPrecision')).toBeFalsy();
      expect(component.formatOptions?.value).toEqual({ isLocaleFormat: true, unit: null });
    });
    it('should set default format options for DECIMAL field type', () => {
      component.form.patchValue({ type: FieldType.DECIMAL });

      expect(component.formatOptions).toBeTruthy();
      expect(component.formatOptions?.get('dateFormat')).toBeFalsy();
      expect(component.formatOptions?.get('unit')).toBeTruthy();
      expect(component.formatOptions?.get('isLocaleFormat')).toBeTruthy();
      expect(component.formatOptions?.get('decimalPrecision')).toBeTruthy();
      expect(component.formatOptions?.value).toEqual({ isLocaleFormat: true, unit: null, decimalPrecision: 2 });
    });
    it('should set default format options for INSTANT field type', () => {
      component.form.patchValue({ type: FieldType.INSTANT });

      expect(component.formatOptions).toBeTruthy();
      expect(component.formatOptions?.get('dateFormat')).toBeTruthy();
      expect(component.formatOptions?.get('unit')).toBeFalsy();
      expect(component.formatOptions?.get('isLocaleFormat')).toBeFalsy();
      expect(component.formatOptions?.get('decimalPrecision')).toBeFalsy();
      expect(component.formatOptions?.value).toEqual({ dateFormat: DEFAULT_DATE_FORMAT.value });
    });
    it('should set formatOptions to undefined for any other field type', () => {
      component.form.patchValue({ type: FieldType.STRING });
      expect(component.formatOptions).toBeFalsy();

      component.form.patchValue({ type: FieldType.POINT });
      expect(component.formatOptions).toBeFalsy();

      component.form.patchValue({ type: FieldType.KEYWORD });
      expect(component.formatOptions).toBeFalsy();
    });
  });

  it('should return API compliant form value', () => {
    component.form.patchValue({
      name: 'my-field',
      type: FieldType.DECIMAL,
      formatOptions: { unit: 'unit', decimalPrecision: 2 }
    });
    expect(component.getFormValue()).toEqual({
      name: 'my-field',
      type: FieldType.DECIMAL,
      unit: 'unit',
      decimalPrecision: 2,
      isLocaleFormat: true, // set to true by default
      crs: undefined,
      format: undefined
    });
  });
});
