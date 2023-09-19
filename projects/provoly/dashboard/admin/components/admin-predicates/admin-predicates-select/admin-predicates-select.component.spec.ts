import { Location } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { preds } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminActions } from '../../../store/admin.actions';
import { PredicatesActions } from '../store/predicates.actions';
import { PredicatesSelectors } from '../store/predicates.selectors';
import { AdminPredicatesSelectComponent } from './admin-predicates-select.component';
import { MockPryTabComponent } from '@provoly/dashboard/mock/components/mock-pry-tab.component';
import { MockPryTabGroupComponent } from '@provoly/dashboard/mock/components/mock-pry-tab-group.component';

describe('AdminPredicatesSelectComponent', () => {
  let component: AdminPredicatesSelectComponent;
  let fixture: ComponentFixture<AdminPredicatesSelectComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminPredicatesSelectComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockI18nPipe,
        MockPryTabComponent,
        MockPryTabGroupComponent
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: PredicatesSelectors.currentPredicate,
              value: preds[0]
            }
          ]
        })
      ],
      imports: [FormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPredicatesSelectComponent);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close panel and dispatch action', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.closePanel();
    expect(spyStore.mock.calls).toEqual([
      [PredicatesActions.loadPredicates()],
      [AdminActions.togglePanel({ panelOpen: false })],
      [
        AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: '/predicates/new' }),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'predicates',
              actionAccess: 'write'
            }
          ]
        })
      ]
    ]);
  }));
});
