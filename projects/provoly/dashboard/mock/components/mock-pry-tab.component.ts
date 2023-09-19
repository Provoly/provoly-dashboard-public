// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-tab',
  template: '<p>Mock tab/p>'
})
export class MockPryTabComponent {
  @Input() templateRef = '';
  @Input() index = 0;
}
