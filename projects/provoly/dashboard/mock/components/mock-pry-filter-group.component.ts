// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-filter-group',
  template: '<p>Mock Filter Group</p>'
})
export class MockPryFilterGroupComponent {
  @Input() enterTriggerFilter = false;
  @Input() clearTriggerFilter = false;
}
