import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryAttributesFormComponent } from '../../../../../mock/components/admin/classes/mock-pry-attributes-form.component';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../../admin-routing.module';
import { AdminAttributesEditComponent } from './admin-attributes-edit.component';

describe('AdminAttributesEditComponent', () => {
  let component: AdminAttributesEditComponent;
  let fixture: ComponentFixture<AdminAttributesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAttributesEditComponent, MockTranslatePipe, MockPryAttributesFormComponent],
      providers: [{ provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard }, provideMockStore({})],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAttributesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
