import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { AdminMetadataUserActions } from '../store/admin-metadata-user.action';

@Component({
  selector: 'pry-admin-user-new-metadata',
  templateUrl: './admin-user-new-metadata.component.html'
})
export class AdminUserNewMetadataComponent {
  constructor(private store: Store<any>) {}

  submit(metadata: IMetadata) {
    this.store.dispatch(AdminMetadataUserActions.createMetadata({ metadata: metadata }));
  }
}
