import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  PRY_ACCESS_GUARD,
  PryDefaultAccessGuard,
  RelationTypesActions,
  RelationTypesSelectors
} from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { relationTypes } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminActions } from '../../../store/admin.actions';
import { AdminRelationTypesSelectComponent } from './admin-relation-types-select.component';
import { MockPryTabComponent } from '@provoly/dashboard/mock/components/mock-pry-tab.component';
import { MockPryTabGroupComponent } from '@provoly/dashboard/mock/components/mock-pry-tab-group.component';

describe('AdminLinksSelectComponent', () => {
  let component: AdminRelationTypesSelectComponent;
  let fixture: ComponentFixture<AdminRelationTypesSelectComponent>;
  let store: MockStore<AdminRelationTypesSelectComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminRelationTypesSelectComponent,
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
              selector: RelationTypesSelectors.selectedRelationType,
              value: relationTypes[0]
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRelationTypesSelectComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close panel and dispatch action', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.closePanel();
    expect(spyStore.mock.calls).toEqual([
      [AdminActions.togglePanel({ panelOpen: false })],
      [RelationTypesActions.unSelectRelationType()],
      [
        AdminActions.mainActions({
          actions: [
            {
              action: RelationTypesActions.openModal(),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'relation_types',
              actionAccess: 'write'
            }
          ]
        })
      ]
    ]);
  }));
});
