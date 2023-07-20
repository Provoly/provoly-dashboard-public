// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-expand-value',
  template: '<p>Mock</p>'
})
export class MockPryExpandValueComponent {
  @Input() value: any;
}
