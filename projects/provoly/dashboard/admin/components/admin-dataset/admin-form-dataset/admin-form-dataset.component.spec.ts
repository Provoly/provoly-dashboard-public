import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PryI18nService, PrySelectModule } from '@provoly/dashboard';

import { AdminFormDatasetComponent } from './admin-form-dataset.component';
import { AdminService } from '../../../store/admin.service';
import { MockTranslatePipe } from '@provoly/dashboard/mock/pipe/mock-translate.pipe';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

describe('AdminFormDatasetComponent', () => {
  PryI18nService.warn = false;
  let component: AdminFormDatasetComponent;
  let fixture: ComponentFixture<AdminFormDatasetComponent>;
  let router;
  let adminService: AdminService;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFormDatasetComponent, MockTranslatePipe, MockI18nPipe],
      providers: [provideMockStore({}), { provide: PryI18nService, useClass: MockPryI18nService }],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, PrySelectModule, HttpClientTestingModule]
    }).compileComponents();
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
