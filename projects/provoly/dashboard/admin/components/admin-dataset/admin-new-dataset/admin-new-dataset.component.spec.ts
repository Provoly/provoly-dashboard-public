import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryAdminFormDatasetComponent } from '@provoly/dashboard/mock/components/admin/dataset/mock-pry-form-dataset.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { AdminNewDatasetComponent } from './admin-new-dataset.component';

describe('AdminNewDatasetComponent', () => {
  let component: AdminNewDatasetComponent;
  let fixture: ComponentFixture<AdminNewDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminNewDatasetComponent, MockTranslatePipe, MockPryAdminFormDatasetComponent, MockI18nPipe],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNewDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
