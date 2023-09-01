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

import { AdminFormMetadataRulesComponent } from './admin-form-metadata-rules.component';

describe('AdminFormMetadataRulesComponent', () => {
  PryI18nService.warn = false;
  let component: AdminFormMetadataRulesComponent;
  let fixture: ComponentFixture<AdminFormMetadataRulesComponent>;
  let router;
  let adminService: AdminService;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFormMetadataRulesComponent, MockTranslatePipe, MockI18nPipe],
      providers: [provideMockStore({})],
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule, PrySelectModule, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFormMetadataRulesComponent);
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
