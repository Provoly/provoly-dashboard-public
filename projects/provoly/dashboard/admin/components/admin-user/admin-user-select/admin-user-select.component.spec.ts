import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard, PryI18nService, PrySelectModule } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { metadata, users } from '../../../../mock/data/mockItemAdmin';
import { MockPryAccessDirective } from '../../../../mock/directive/mock-pry-access.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminActions } from '../../../store/admin.actions';
import { AdminUserActions } from '../store/admin-user.action';
import { AdminUserSelectors } from '../store/admin-user.selector';
import { AdminUserSelectComponent } from './admin-user-select.component';

describe('AdminUserSelectComponent', () => {
  PryI18nService.warn = false;
  let component: AdminUserSelectComponent;
  let fixture: ComponentFixture<AdminUserSelectComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminUserSelectComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPryAccessDirective,
        MockI18nPipe
      ],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: AdminUserSelectors.selectedUser,
              value: users[0]
            },
            {
              selector: AdminUserSelectors.selectedMetadataUser,
              value: []
            }
          ]
        })
      ],
      imports: [PrySelectModule, FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserSelectComponent);
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
      [AdminActions.togglePanel({ panelOpen: false })],
      [AdminUserActions.unselectUser()]
    ]);
  }));

  it('should add new metadata', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.metaForm.patchValue({
      metadata: metadata[0],
      value: 'string'
    });
    component.addMetadataUser();
    expect(component.metaForm.valid).toEqual(true);
    expect(spyStore.mock.calls).toEqual([
      [
        AdminUserActions.addMetadataUser({
          userId: 'idBuffy',
          metaId: 'id',
          value: 'string'
        })
      ]
    ]);
  }));
});
