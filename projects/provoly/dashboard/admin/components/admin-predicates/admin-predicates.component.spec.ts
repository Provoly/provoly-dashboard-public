import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { preds } from '../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminActions } from '../../store/admin.actions';
import { AdminPredicatesComponent } from './admin-predicates.component';
import { PredicatesActions } from './store/predicates.actions';
import { PredicatesSelectors } from './store/predicates.selectors';

describe('AdminPredicatesComponent', () => {
  let component: AdminPredicatesComponent;
  let fixture: ComponentFixture<AdminPredicatesComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminPredicatesComponent,
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
              selector: PredicatesSelectors.predicates,
              value: preds
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPredicatesComponent);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get 1 predicates', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should dispatch current predicate', () => {
    const component = fixture.componentInstance;
    const spyRouteToSelect = jest.spyOn(component, 'goToSelectPredicate');
    const spyStore = jest.spyOn(store, 'dispatch');
    const toClick = fixture.debugElement.query(By.css('tbody tr td:first-child'));

    toClick.nativeElement.click();
    expect(spyRouteToSelect.mock.calls).toEqual([['bc7eabc4-7e2b-44b8-a64b-712c1edd1ad2']]);
    expect(spyStore.mock.calls).toEqual([
      [PredicatesActions.selectPredicate({ id: 'bc7eabc4-7e2b-44b8-a64b-712c1edd1ad2' })],
      [AdminActions.selectComponentType({ componentType: 'AdminPredicatesSelectComponent' })]
    ]);
  });
});
