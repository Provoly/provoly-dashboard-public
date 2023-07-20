// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-drag-widgets',
  template: '<p>Mock Pry drag widgets</p>'
})
export class MockPryDragWidgetsComponent {
  @Input() labels = true;
}
