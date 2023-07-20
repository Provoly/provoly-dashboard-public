import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminClassesEditComponent } from './admin-classes-edit.component';

describe('AdminClassesEditComponent', () => {
  let component: AdminClassesEditComponent;
  let fixture: ComponentFixture<AdminClassesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminClassesEditComponent, MockTranslatePipe, MockPryClassesFormComponent],
      providers: [{ provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard }, provideMockStore({})],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
