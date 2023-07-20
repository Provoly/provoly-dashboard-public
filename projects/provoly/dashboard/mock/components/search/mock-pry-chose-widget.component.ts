// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pry-choose-widget',
  template: '<p>pry mock</p>'
})
export class MockPryChooseWidgetComponent {
  @Input() panelOpen: boolean = false;
  @Output() selected = new EventEmitter<string>();
  @Input() mode = 'button';
  @Input() width = 200;
}
