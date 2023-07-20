// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pry-search-select-attribute',
  template: '<p>pry selector</p>'
})
export class MockPrySelectAttributeComponent {
  @Input() id: any;
  @Output() selectAttributeChange = new EventEmitter();

  onEmit(val: string): void {
    this.selectAttributeChange.emit(val);
  }
}
