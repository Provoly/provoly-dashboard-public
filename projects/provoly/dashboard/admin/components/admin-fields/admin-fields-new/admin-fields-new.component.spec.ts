import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockPryFieldFormComponent } from '../../../../mock/components/admin/fields/mock-pry-field-form.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';

import { AdminFieldsNewComponent } from './admin-fields-new.component';

describe('AdminFieldsNewComponent', () => {
  let component: AdminFieldsNewComponent;
  let fixture: ComponentFixture<AdminFieldsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFieldsNewComponent, MockTranslatePipe, MockPryFieldFormComponent, MockI18nPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFieldsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
