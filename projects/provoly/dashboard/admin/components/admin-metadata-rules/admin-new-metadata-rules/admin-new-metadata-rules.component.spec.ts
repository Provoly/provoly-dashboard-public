import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryAdminFormMetadataRulesComponent } from '../../../../mock/components/admin/metadata-rules/mock-pry-form-metadata-rules.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { AdminNewMetadataRulesComponent } from './admin-new-metadata-rules.component';

describe('AdminNewMetadataRulesComponent', () => {
  let component: AdminNewMetadataRulesComponent;
  let fixture: ComponentFixture<AdminNewMetadataRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminNewMetadataRulesComponent,
        MockTranslatePipe,
        MockPryAdminFormMetadataRulesComponent,
        MockI18nPipe
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNewMetadataRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
