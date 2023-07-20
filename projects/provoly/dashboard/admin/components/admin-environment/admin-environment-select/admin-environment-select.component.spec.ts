import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { envs } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { EnvironmentSelectors } from '../store/environment.selectors';
import { AdminEnvironmentSelectComponent } from './admin-environment-select.component';

describe('AdminEnvironmentSelectComponent', () => {
  let component: AdminEnvironmentSelectComponent;
  let fixture: ComponentFixture<AdminEnvironmentSelectComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEnvironmentSelectComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
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
      imports: [FormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnvironmentSelectComponent);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
