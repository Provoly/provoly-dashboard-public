// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-metadata-condition',
  template: '<p>mock</p>'
})
export class MockPryMetadataConditionComponent {
  @Input() id: any;
  @Input() readonly: any;
}
