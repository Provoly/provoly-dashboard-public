import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryAdminFormMetadataRulesComponent } from '../../../../mock/components/admin/metadata-rules/mock-pry-form-metadata-rules.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';

import { AdminEditMetadataRulesComponent } from './admin-edit-metadata-rules.component';

describe('AdminEditMetadataRulesComponent', () => {
  let component: AdminEditMetadataRulesComponent;
  let fixture: ComponentFixture<AdminEditMetadataRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminEditMetadataRulesComponent,
        MockTranslatePipe,
        MockPryAdminFormMetadataRulesComponent,
        MockI18nPipe
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditMetadataRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
