import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { envs } from '../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminActions } from '../../store/admin.actions';

import { AdminEnvironmentComponent } from './admin-environment.component';
import { EnvironmentActions } from './store/environment.actions';
import { EnvironmentSelectors } from './store/environment.selectors';

describe('AdminEnvironmentComponent', () => {
  let component: AdminEnvironmentComponent;
  let fixture: ComponentFixture<AdminEnvironmentComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminEnvironmentComponent,
        MockTranslatePipe,
        MockSortPipe,
        MockPryCheckboxComponent,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: EnvironmentSelectors.environments,
              value: envs
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEnvironmentComponent);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get 1 Environment', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should dispatch current environment', () => {
    const component = fixture.componentInstance;
    const spyRouteToSelect = jest.spyOn(component, 'goToSelectEnv');
    const spyStore = jest.spyOn(store, 'dispatch');
    const toClick = fixture.debugElement.query(By.css('tbody tr td:first-child'));

    toClick.nativeElement.click();
    expect(spyRouteToSelect.mock.calls).toEqual([[envs[0]]]);
    expect(spyStore.mock.calls).toEqual([
      [EnvironmentActions.selectEnvironment({ name: envs[0].name })],
      [AdminActions.selectComponentType({ componentType: 'AdminEnvironmentSelectComponent' })]
    ]);
  });
});
