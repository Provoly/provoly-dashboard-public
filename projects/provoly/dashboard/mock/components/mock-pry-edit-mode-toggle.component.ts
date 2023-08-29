// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-edit-mode-toggle',
  template: '<p>Mock Pry edit mode toggle</p>'
})
export class MockPryEditModeToggleComponent {
  @Input() labels = true;
  @Input() displayLabels = true;
}
