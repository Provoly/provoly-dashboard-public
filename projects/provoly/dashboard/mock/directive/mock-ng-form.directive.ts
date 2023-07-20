// noinspection AngularMissingOrInvalidDeclarationInModule

import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[ngForm]',
  exportAs: 'ngForm'
})
export class MockNgFormDirective {
  @Input() ngFormOptions: any;
  @Output() ngSubmit = new EventEmitter();
}
