import { Component, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { IMetadata } from '@provoly/dashboard';
import { MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-abac-select-metadata',
  templateUrl: './select-metadata.component.html'
})
export class SelectMetadataComponent {
  metadata$: Observable<IMetadata[]>;

  @Output() metadataSelected = new EventEmitter<string>();

  constructor(private store: Store<any>) {
    this.metadata$ = this.store.select(MetadataSelectors.metadata);
  }

  onSelectMetadata(id: string): void {
    this.metadataSelected.emit(id);
  }
}
