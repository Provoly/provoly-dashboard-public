import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { MetadataActions } from '@provoly/dashboard/components/metadata-editor';

@Component({
  selector: 'pry-admin-new-metadata',
  templateUrl: './admin-new-metadata.component.html'
})
export class AdminNewMetadataComponent {
  constructor(private store: Store<any>) {}

  submit(metadata: IMetadata) {
    this.store.dispatch(MetadataActions.createMetadata({ metadata: metadata }));
  }
}
