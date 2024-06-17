import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PryI18nService, PrySelectModule } from '@provoly/dashboard';
import { field } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { FieldsActions } from '../store/fields.actions';
import { AdminFieldsFormComponent } from './admin-fields-form.component';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

describe('AdminFieldsFormComponent', () => {
  let component: AdminFieldsFormComponent;
  let fixture: ComponentFixture<AdminFieldsFormComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFieldsFormComponent, MockTranslatePipe, MockI18nPipe],
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
    expect(component.fieldForm.valid).toBeFalsy();
  });

  it('should create new field', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.fieldForm.setValue(field);
    component.addField();
    expect(component.fieldForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[FieldsActions.saveField({ field: field, route: '/' })]]);
  }));

  it('should update current field', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.fieldForm.setValue(field);
    let editedField = field;
    editedField.name = 'toto';
    component.fieldForm.patchValue({ name: 'toto' });
    component.addField();
    expect(component.fieldForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([[FieldsActions.saveField({ field: editedField, route: '/' })]]);
  }));

  it('should not update current field because name is required', fakeAsync(() => {
    component.fieldForm.setValue(field);
    component.fieldForm.patchValue({ name: '' });
    component.addField();
    expect(component.fieldForm.valid).toEqual(false);
  }));
});
