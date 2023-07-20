// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pry-multi-class-field-selection',
  template: '<p>pry mock</p>'
})
export class MockPryMultiClassFieldSelectionComponent {
  @Input() conditionId: any;
  @Output() closeModal = new EventEmitter();
  @Output() selectFieldChange = new EventEmitter<any>();
}
