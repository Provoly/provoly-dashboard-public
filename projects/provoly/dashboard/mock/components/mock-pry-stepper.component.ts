// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pry-stepper',
  template: '<p>pry mock</p>'
})
export class MockPryStepperComponent {
  @Input() isConsultMode: boolean = false;
  @Output() lastStepCompleted: EventEmitter<void> = new EventEmitter<void>();
}
