import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PrySelectModule } from '@provoly/dashboard';
import { MockPryEnvironnmentFormComponent } from '../../../../mock/components/admin/environnment/mock-pry-environnment-form.component';
import { envs } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { EnvironmentSelectors } from '../store/environment.selectors';
import { AdminEnvironmentUpdateComponent } from './admin-environment-update.component';

describe('AdminEnvironmentUpdateComponent', () => {
  let component: AdminEnvironmentUpdateComponent;
  let fixture: ComponentFixture<AdminEnvironmentUpdateComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminEnvironmentUpdateComponent,
        MockTranslatePipe,
        MockPryEnvironnmentFormComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: EnvironmentSelectors.currentEnv,
              value: envs[0]
            }
          ]
        })
      ],
      imports: [PrySelectModule, FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnvironmentUpdateComponent);
    store = TestBed.inject(MockStore);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
