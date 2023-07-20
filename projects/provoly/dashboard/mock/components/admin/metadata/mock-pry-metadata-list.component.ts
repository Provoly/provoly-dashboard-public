// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMetadata } from '../../../../admin/store/admin-api.model';

@Component({
  selector: 'pry-list-metadata',
  template: '<p>mock</p>'
})
export class MockPryMetadataListComponent {
  @Input() sortActive = '';

  @Input() sortDirection = '';

  @Input() configHeader = [];

  @Input() metadata = [];

  @Input() selectedMetadata = null;

  @Input() labelMetadataSelected = '';

  @Input() editable = true;

  @Output() editClicked$: EventEmitter<IMetadata> = new EventEmitter<IMetadata>();
}
