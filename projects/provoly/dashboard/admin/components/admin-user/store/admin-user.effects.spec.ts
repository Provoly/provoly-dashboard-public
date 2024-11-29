import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { metadataUser, users } from '../../../../mock/data/mockItemAdmin';
import { AdminService } from '../../../store/admin.service';
import { AdminUserEffects } from './admin-user.effects';
import { AdminUserState, initialAdminUserState } from './admin-user.reducer';

const buildState = (state: Partial<AdminUserState>) =>
  Object.assign({}, { '@pry/admin': structuredClone({ ...initialAdminUserState, ...state }) });

describe('AdminUserEffects', () => {
  let actions$: Observable<any>;
  let effects: AdminUserEffects;
  let adminService: AdminService;
  const initialState = initialAdminUserState;
  let store: MockStore<any>;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AdminUserEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: buildState({}) }),
        {
          provide: AdminService,
          useValue: {
            getUsers: () => of(users),
            getMetadataUser: () => of(metadataUser),
            addMetadataUser: () => of(''),
            deleteMetadataUser: () => of('')
          }
        }
      ]
    });

    effects = TestBed.inject(AdminUserEffects);
    adminService = TestBed.inject<AdminService>(AdminService);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
