import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PrySelectModule } from '@provoly/dashboard';
import { metadata } from '../../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { AdminService } from '../../../../store/admin.service';

import { FormMetadataComponent } from './form-metadata.component';

describe('FormMetadataComponent', () => {
  let component: FormMetadataComponent;
  let fixture: ComponentFixture<FormMetadataComponent>;
  let router;
  let adminService: AdminService;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormMetadataComponent, MockTranslatePipe, MockI18nPipe],
      providers: [provideMockStore({})],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, PrySelectModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMetadataComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    adminService = TestBed.inject(AdminService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.metaForm.valid).toBeFalsy();
  });

  it('should create new metadata', fakeAsync(() => {
    component.metaForm.setValue(metadata[0]);
    component.addMetadata();

    expect(component.metaForm.valid).toEqual(true);
  }));

  it('should update current Metadata', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.metadata = metadata[0];
    component.metaForm.setValue(metadata[0]);
    let editedMeta = metadata[0];
    editedMeta.name = 'toto';
    component.metaForm.patchValue({ name: 'toto' });
    component.addMetadata();

    expect(component.metaForm.valid).toEqual(true);
  }));

  it('should not update current Predicate because name is required', fakeAsync(() => {
    component.metadata = metadata[0];
    component.metaForm.setValue(metadata[0]);
    component.metaForm.patchValue({ name: '' });
    component.addMetadata();

    expect(component.metaForm.valid).toEqual(false);
  }));
});
