// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-clear-view',
  template: '<p>mock</p>'
})
export class MockPryClearViewComponent {
  @Input() label = true;
}
