// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-filter-settings',
  template: '<p>Mock Filter Settings</p>'
})
export class MockPryFilterSettingsComponent {
  @Input() label = true;
}
