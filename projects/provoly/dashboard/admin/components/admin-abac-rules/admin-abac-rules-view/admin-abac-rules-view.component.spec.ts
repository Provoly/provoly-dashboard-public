import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryAbacRulesFormComponent } from '../../../../mock/components/admin/abac/mock-pry-abac-form.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { AdminAbacRulesViewComponent } from './admin-abac-rules-view.component';

describe('AdminAbacRulesViewComponent', () => {
  let component: AdminAbacRulesViewComponent;
  let fixture: ComponentFixture<AdminAbacRulesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AdminAbacRulesViewComponent, MockTranslatePipe, MockPryAbacRulesFormComponent, MockI18nPipe],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAbacRulesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
