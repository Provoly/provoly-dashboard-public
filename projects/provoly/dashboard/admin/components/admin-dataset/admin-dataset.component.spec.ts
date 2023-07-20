import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PryI18nService } from '@provoly/dashboard';
import { MockPryModalComponent } from '../../../mock/components/mock-pry-modal.component';
import { MockNgModelDirective } from '../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminDatasetComponent } from './admin-dataset.component';

describe('AdminDatasetComponent', () => {
  let component: AdminDatasetComponent;
  let fixture: ComponentFixture<AdminDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminDatasetComponent,
        MockTranslatePipe,
        MockPryModalComponent,
        MockNgModelDirective,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({}),
        { provide: PryI18nService, useValue: { instant: (key: string) => key } }
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
