// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-admin-attributes-form',
  template: '<p>mock</p>'
})
export class MockPryAttributesFormComponent {
  @Input() selectedClass = {};
  @Input() selectedAttribute = {};
}
