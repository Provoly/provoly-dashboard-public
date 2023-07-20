// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pry-checkbox',
  template: '<p>pry selector</p>'
})
export class MockPryCheckboxComponent {
  @Input() value: any;
  @Output() valueChanged?: EventEmitter<any>;
}
