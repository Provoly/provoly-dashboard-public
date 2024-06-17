import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PryI18nService } from '@provoly/dashboard';
import { MockPryModalComponent } from '../../../mock/components/mock-pry-modal.component';
import { MockNgModelDirective } from '../../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminMetadataRulesComponent } from './admin-metadata-rules.component';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

describe('AdminMetadataRulesComponent', () => {
  let component: AdminMetadataRulesComponent;
  let fixture: ComponentFixture<AdminMetadataRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminMetadataRulesComponent,
        MockTranslatePipe,
        MockPryModalComponent,
        MockNgModelDirective,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({}),
        { provide: PryI18nService, useClass: MockPryI18nService }
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMetadataRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
