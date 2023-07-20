import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { users } from '../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminActions } from '../../store/admin.actions';
import { AdminUserComponent } from './admin-user.component';
import { AdminUserActions } from './store/admin-user.action';
import { AdminUserSelectors } from './store/admin-user.selector';

describe('AdminUserComponent', () => {
  let component: AdminUserComponent;
  let fixture: ComponentFixture<AdminUserComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminUserComponent,
        MockTranslatePipe,
        MockPryCheckboxComponent,
        MockSortPipe,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: AdminUserSelectors.users,
              value: users
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get 1 user', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should dispatch current user', () => {
    const component = fixture.componentInstance;
    const spyRouteToSelect = jest.spyOn(component, 'selectUser');
    const spyStore = jest.spyOn(store, 'dispatch');
    const toClick = fixture.debugElement.query(By.css('tbody tr td:first-child'));

    toClick.nativeElement.click();
    expect(spyRouteToSelect.mock.calls).toEqual([[users[0]]]);
    expect(spyStore.mock.calls).toEqual([
      [AdminUserActions.selectUser({ userId: 'idBuffy' })],
      [AdminActions.selectComponentType({ componentType: 'AdminUserSelectComponent' })]
    ]);
  });
});
