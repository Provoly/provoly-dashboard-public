import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { classes } from '../../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslateIdPipe } from '../../../../mock/pipe/mock-translate-id.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminActions } from '../../../store/admin.actions';
import { AdminClassActions } from '../store/admin-class.actions';
import { AdminClassSelectors } from '../store/admin-class.selectors';

import { AdminClassesSelectComponent } from './admin-classes-select.component';

describe('AdminClassesSelectComponent', () => {
  let component: AdminClassesSelectComponent;
  let fixture: ComponentFixture<AdminClassesSelectComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminClassesSelectComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockTranslateIdPipe,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: AdminClassSelectors.selectedClass,
              value: classes[0]
            }
          ]
        })
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassesSelectComponent);
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
      [AdminClassActions.unselectClass()],
      [AdminActions.togglePanel({ panelOpen: false })],
      [
        AdminActions.mainActions({
          actions: [
            {
              action: AdminActions.routeTo({ path: '/classes/new' }),
              label: 'add',
              icon: 'add_column',
              moduleAccess: 'admin',
              pageAccess: 'classes',
              actionAccess: 'write'
            }
          ]
        })
      ]
    ]);
  }));
});
