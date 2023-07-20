import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryAbacRulesFormComponent } from '../../../../mock/components/admin/abac/mock-pry-abac-form.component';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { AdminAbacRulesEditComponent } from './admin-abac-rules-edit.component';

describe('AdminAbacRulesEditComponent', () => {
  let component: AdminAbacRulesEditComponent;
  let fixture: ComponentFixture<AdminAbacRulesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AdminAbacRulesEditComponent,
        MockTranslatePipe,
        MockPryAbacRulesFormComponent,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAbacRulesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
