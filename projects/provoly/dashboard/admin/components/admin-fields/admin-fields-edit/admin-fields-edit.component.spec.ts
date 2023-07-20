import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryFieldFormComponent } from '../../../../mock/components/admin/fields/mock-pry-field-form.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminFieldsEditComponent } from './admin-fields-edit.component';

describe('AdminFieldsEditComponent', () => {
  let component: AdminFieldsEditComponent;
  let fixture: ComponentFixture<AdminFieldsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminFieldsEditComponent, MockTranslatePipe, MockPryFieldFormComponent, MockI18nPipe],
      providers: [{ provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard }, provideMockStore({})],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFieldsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
