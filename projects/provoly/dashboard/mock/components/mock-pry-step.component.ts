// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'pry-step',
  template: '<p>pry mock</p>'
})
export class MockPryStepComponent {
  @HostBinding('class.active-step')
  isActive = false;

  @Input() setActiveState(step: this) {
    this.isActive = step === this;
  }
}
