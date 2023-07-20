// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pry-nq-color-selector',
  template: '<p>Mock</p>'
})
export class MockPryNqColorSelectorComponent {
  @Input() disabled = false;
  @Input() datasource: any;
  @Output() colorChanged = new EventEmitter<string>();
}
