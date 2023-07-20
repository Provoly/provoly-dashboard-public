// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-form-metadata',
  template: '<p>mock</p>'
})
export class MockPryMetadataFormComponent {
  @Input() titleForm = '';
  @Input() isMetaSimpleEdit = false;
  @Input() metadata = {};
  @Input() isMetaUser: any;
}
