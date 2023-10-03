// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-metadata-editor',
  template: '<p>Mock metadata editor/p>'
})
export class MockPryMetadataEditorComponent {
  @Input() targetId = '';
  @Input() metadata = '';
  @Input() initialMetadataSelection = '';
  @Input() isModification = false;
  @Input() type = 'meta';
}
