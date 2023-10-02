import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserInfo } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { AdminUserActions } from './store/admin-user.action';
import { AdminUserSelectors } from './store/admin-user.selector';

@Component({
  selector: 'pry-admin-user',
  templateUrl: './admin-user.component.html'
})
export class AdminUserComponent {
  users$: Observable<UserInfo[]>;
  selectedUser$: Observable<UserInfo | undefined>;
  sortActive? = 'name';
  sortDirection? = 'asc';

  constructor(private store: Store<AdminUserComponent>, private router: Router, private route: ActivatedRoute) {
    this.store.dispatch(AdminUserActions.unselectUser());
    this.store.dispatch(AdminUserActions.loadUsers());
    this.users$ = this.store.select(AdminUserSelectors.users);
    this.selectedUser$ = this.store.select(AdminUserSelectors.selectedUser);

    this.store.dispatch(AdminActions.mainActions({ actions: [] }));
  }

  selectUser(user: UserInfo) {
    this.store.dispatch(AdminUserActions.selectUser({ userId: user.id }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminUserSelectComponent' }));
  }
}
