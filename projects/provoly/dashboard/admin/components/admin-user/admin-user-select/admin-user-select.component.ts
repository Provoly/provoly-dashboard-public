import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IMetadata, MetadataUser, UserInfo } from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { AdminMetadataUserActions } from '../../admin-metadata-user/store/admin-metadata-user.action';
import { AdminMetadataUserSelectors } from '../../admin-metadata-user/store/admin-metadata-user.selector';
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
  metadataAvailable$?: Observable<IMetadata[]>;

  metaForm: UntypedFormGroup;
  tab: number = 0;
  sub = new Subscription();
  editable = false;

  isSubmitted = false;

  @Input() profil: boolean = false;

  constructor(
    private store: Store<AdminUserSelectComponent>,
    private formBuilder: UntypedFormBuilder
  ) {
    this.store.dispatch(AdminMetadataUserActions.loadMetadata());

    this.selectedUser$ = this.store.select(AdminUserSelectors.selectedUser);
    this.userMetadata$ = this.store.select(AdminUserSelectors.selectedMetadataUser);
    this.metadata$ = this.store.select(AdminMetadataUserSelectors.metadata);
    this.editable$ = this.store.select(AdminUserSelectors.editable);

    this.compId = nextCompId++;

    this.metaForm = this.formBuilder.group({
      metadata: [{}, [Validators.required]],
      value: ['', [Validators.required, Validators.pattern('^[+-]?[0-9]*$')]]
    });
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

    this.metadataAvailable$ = combineLatest([this.userMetadata$, this.metadata$]).pipe(
      map(([userMetas, metaDefs]) => {
        let userMetaIds = userMetas?.map((u) => u.userProfile.id);
        return metaDefs.filter((meta) => !userMetaIds?.includes(meta.id));
      })
    );

    this.sub.add(
      this.metadataAvailable$.subscribe((meta) => {
        this.metaForm.patchValue({
          metadata: meta[0]
        });
        this.onMetaChange(meta[0]);
        this.metaForm.patchValue({ value: '' });
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  closePanel() {
    this.store.dispatch(AdminActions.togglePanel({ panelOpen: false }));
    this.store.dispatch(AdminUserActions.unselectUser());
  }

  addMetadataUser() {
    this.isSubmitted = true;
    if (this.metaForm.valid) {
      this.isSubmitted = false;
      let payload = {
        userId: this.userId,
        metaId: this.metaForm.value['metadata']['id'],
        value: this.metaForm.value['value']
      };
      this.store.dispatch(AdminUserActions.addMetadataUser(payload));
    }
  }

  onMetaChange(metadata: IMetadata) {
    if (metadata) {
      if (metadata.type === 'INTEGER') {
        this.metaForm.controls['value'].setValidators([Validators.required, Validators.pattern('^[+-]?[0-9]*$')]);
      } else if (metadata.type === 'DOUBLE') {
        this.metaForm.controls['value'].setValidators([
          Validators.required,
          Validators.pattern('[+-]?([0-9]*[.])?[0-9]+')
        ]);
      } else {
        this.metaForm.controls['value'].setValidators([Validators.required]);
      }
    }
  }

  removeMetadata(metadata: MetadataUser) {
    this.store.dispatch(
      AdminUserActions.deleteMetadataUser({ userId: this.userId, metadataId: metadata.userProfile.id })
    );
  }

  editMetadata(currentMetadata: MetadataUser) {
    this.store.dispatch(AdminUserActions.isEditable({ editable: true }));
    let value = currentMetadata.value;
    let userProfile = currentMetadata.userProfile;

    this.metaForm.patchValue({
      metadata: userProfile,
      value: value
    });
    this.onMetaChange(userProfile);
  }

  switch(number: number) {
    this.tab = number;
  }
}
