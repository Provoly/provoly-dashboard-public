// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-named-query',
  template: '<p>Mock Pry NamedQuery</p>'
})
export class MockPryNamedQueryComponent {
  @Input() label = true;
}
