// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-launch-tab',
  template: '<p>Mock launch tab</p>'
})
export class MockPryLaunchTabComponent {
  @Input() label = true;
}
