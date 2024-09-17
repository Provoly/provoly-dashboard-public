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
  currentUsermetadatas?: MetadataUser[] | undefined;
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
    this.userMetadata$.subscribe((metas) => {
      this.currentUsermetadatas = metas;
    });
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
    const newMetadatas = this.getCurrentMetadatasValuesOfUserProfile(metadata.metadataId)
      // removing redundant values
      .filter((val) => val !== metadata.value)
      // removing  previous value if editing
      .filter((val) => !metadata.previousValue || val !== metadata.previousValue);
    if (metadata.value) {
      newMetadatas.push(metadata.value);
    }
    this.store.dispatch(
      MetadataActions.addMetadataUser({
        userId: metadata.id,
        metaId: metadata.metadataId,
        value: newMetadatas
      })
    );
  }

  removeMetadata(metadata: MetaEventType) {
    this.store.dispatch(MetadataActions.deleteMetadataUser({ userId: this.userId, metadataId: metadata.metadataId }));
  }

  private getCurrentMetadatasValuesOfUserProfile(userProfileId: string): any[] {
    return (
      this.currentUsermetadatas
        ?.filter((metadata) => metadata.userProfile.id === userProfileId)
        .map((metadata) => metadata.value) ?? []
    );
  }
}
