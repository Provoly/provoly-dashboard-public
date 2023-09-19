import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { field } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminActions } from '../../../store/admin.actions';
import { FieldsActions } from '../store/fields.actions';
import { FieldsSelectors } from '../store/fields.selectors';
import { AdminFieldsSelectComponent } from './admin-fields-select.component';
import { MockPryTabComponent } from '@provoly/dashboard/mock/components/mock-pry-tab.component';
import { MockPryTabGroupComponent } from '@provoly/dashboard/mock/components/mock-pry-tab-group.component';

describe('AdminFieldsSelectComponent', () => {
  let component: AdminFieldsSelectComponent;
  let fixture: ComponentFixture<AdminFieldsSelectComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminFieldsSelectComponent,
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
              selector: FieldsSelectors.selectedField,
              value: field
            }
          ]
        })
      ],
      imports: [FormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFieldsSelectComponent);
    store = TestBed.inject(MockStore);
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
      [FieldsActions.unselectField()],
      [AdminActions.togglePanel({ panelOpen: false })],
      [
        AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: '/fields/new' }),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'fields',
              actionAccess: 'write'
            }
          ]
        })
      ]
    ]);
  }));
});
