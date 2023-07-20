// noinspection AngularMissingOrInvalidDeclarationInModule

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'pry-settings',
  template: '<p>pry settings</p>'
})
export class MockPrySettingsComponent {
  @Input() widgetIndex: any;
  @Input() isDisable?: boolean;
  @Input() headerPresent: any;
  @Output() saveTriggered = new EventEmitter<void>();
  @Input() open$: Observable<void> | Subject<void> = new Subject<void>();
  @Input() header?: any;
}
