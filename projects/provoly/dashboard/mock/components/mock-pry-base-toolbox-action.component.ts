// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-base-toolbox-action',
  template: '<p>pry mock</p>'
})
export class MockPryBaseToolboxActionComponent {
  @Input() baseToolboxTranslation = '';
  @Input() action: any;
  @Input() iconAction: any;
}
