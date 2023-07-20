// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-base-toolbox',
  template: '<p>pry mock</p>'
})
export class MockPryBaseToolboxComponent {
  @Input() baseToolboxTranslation = '';
  @Input() actions$?: any;
  @Input() subActions$?: any;
}
