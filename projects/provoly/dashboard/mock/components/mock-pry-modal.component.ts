// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-modal',
  template: '<p>Mock</p>'
})
export class MockPryModalComponent {
  @Input() titleModal: any;
  @Input() opened: any;
  @Input() validateLabel: any;
  @Input() validateAction: any;
  @Input() cancelLabel: any;
  @Input() cancelAction: any;
}
