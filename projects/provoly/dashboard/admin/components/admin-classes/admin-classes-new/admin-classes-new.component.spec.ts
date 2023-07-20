import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminClassesNewComponent } from './admin-classes-new.component';

describe('AdminClassesNewComponent', () => {
  let component: AdminClassesNewComponent;
  let fixture: ComponentFixture<AdminClassesNewComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminClassesNewComponent,
        MockTranslatePipe,
        MockPryClassesFormComponent,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [{ provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard }, provideMockStore({})],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassesNewComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
