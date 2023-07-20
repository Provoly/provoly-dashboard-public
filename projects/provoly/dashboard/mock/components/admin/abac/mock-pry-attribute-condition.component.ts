// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-attribute-condition',
  template: '<p>mock</p>'
})
export class MockPryAttributeConditionComponent {
  @Input() id: any;
  @Input() readonly: any;
}
