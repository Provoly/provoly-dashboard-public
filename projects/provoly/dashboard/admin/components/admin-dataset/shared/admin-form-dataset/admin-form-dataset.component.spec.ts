import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PryI18nService, PrySelectModule } from '@provoly/dashboard';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { AdminService } from '../../../../store/admin.service';

import { AdminFormDatasetComponent } from './admin-form-dataset.component';

describe('AdminFormDatasetComponent', () => {
  PryI18nService.warn = false;
  let component: AdminFormDatasetComponent;
  let fixture: ComponentFixture<AdminFormDatasetComponent>;
  let router;
  let adminService: AdminService;
  let store: MockStore<any>;
  let i18n: PryI18nService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFormDatasetComponent, MockTranslatePipe, MockI18nPipe],
      providers: [provideMockStore({})],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, PrySelectModule, HttpClientTestingModule]
    }).compileComponents();
    i18n = TestBed.inject(PryI18nService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormDatasetComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    adminService = TestBed.inject(AdminService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
