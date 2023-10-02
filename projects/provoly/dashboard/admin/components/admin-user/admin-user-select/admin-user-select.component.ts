import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMetadata, MetadataUser, UserInfo } from '@provoly/dashboard';
import { MetadataActions, MetadataSelectors, MetaEventType } from '@provoly/dashboard/components/metadata-editor';
import { Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminUserActions } from '../store/admin-user.action';
import { AdminUserSelectors } from '../store/admin-user.selector';

let nextCompId = 0;

@Component({
  selector: 'pry-admin-user-select',
  templateUrl: './admin-user-select.component.html'
})
export class AdminUserSelectComponent implements OnInit, OnDestroy {
  static id = 'AdminUserSelectComponent';
  userId = '';
  compId: number;
  selectedUser$: Observable<UserInfo | undefined>;
  userMetadata$: Observable<MetadataUser[] | undefined>;
  editable$: Observable<boolean>;

  metadata$: Observable<IMetadata[]>;

  tab: number = 0;
  sub = new Subscription();
  editable = false;

  isSubmitted = false;

  @Input() profil: boolean = false;

  constructor(private store: Store<AdminUserSelectComponent>) {
    this.store.dispatch(MetadataActions.loadUserProfile());

    this.selectedUser$ = this.store.select(AdminUserSelectors.selectedUser);
    this.userMetadata$ = this.store.select(MetadataSelectors.selectedUserProfile);
    this.metadata$ = this.store.select(MetadataSelectors.userProfile);
    this.editable$ = this.store.select(AdminUserSelectors.editable);

    this.compId = nextCompId++;
  }

  ngOnInit(): void {
    this.sub.add(
      this.selectedUser$.subscribe((user) => {
        if (user) {
          this.userId = user.id;
        }
      })
    );

    this.sub.add(this.editable$.subscribe((edit) => (this.editable = edit)));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  closePanel() {
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.store.dispatch(AdminUserActions.unselectUser());
  }

  addMetadataUser(metadata: MetaEventType) {
    this.store.dispatch(
      MetadataActions.addMetadataUser({
        userId: metadata.id,
        metaId: metadata.metadataId,
        value: metadata.value
      })
    );
  }

  removeMetadata(metadata: MetaEventType) {
    this.store.dispatch(MetadataActions.deleteMetadataUser({ userId: this.userId, metadataId: metadata.metadataId }));
  }

  switch(number: number) {
    this.tab = number;
  }
}
