import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  PRY_ACCESS_GUARD,
  PryDefaultAccessGuard,
  RelationTypesActions,
  RelationTypesSelectors
} from '@provoly/dashboard';
import { MockAdminRelationTypesModalComponent } from '../../../mock/components/admin/relation-types/mock-pry-admin-link-modal.component';
import { MockPryCheckboxComponent } from '../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { relationTypes } from '../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../admin-routing.module';
import { AdminActions } from '../../store/admin.actions';
import { AdminRelationTypesComponent } from './admin-relation-types.component';

describe('AdminRelationTypesComponent', () => {
  let component: AdminRelationTypesComponent;
  let fixture: ComponentFixture<AdminRelationTypesComponent>;
  let store: MockStore<AdminRelationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminRelationTypesComponent,
        MockTranslatePipe,
        MockPryCheckboxComponent,
        MockSortPipe,
        MockAdminRelationTypesModalComponent,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: RelationTypesSelectors.relationsTypes,
              value: relationTypes
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRelationTypesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get 1 link', () => {
    expect(fixture.debugElement.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('should dispatch current link', () => {
    const component = fixture.componentInstance;
    const spyRouteToSelect = jest.spyOn(component, 'selectlink');
    const spyStore = jest.spyOn(store, 'dispatch');
    const toClick = fixture.debugElement.query(By.css('tbody tr td:first-child'));

    toClick.nativeElement.click();
    expect(spyRouteToSelect.mock.calls).toEqual([[relationTypes[0]]]);
    expect(spyStore.mock.calls).toEqual([
      [RelationTypesActions.selectRelationType({ id: 'id1' })],
      [AdminActions.selectComponentType({ componentType: 'AdminRelationTypesSelectComponent' })]
    ]);
  });
});
