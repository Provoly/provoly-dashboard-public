// noinspection AngularMissingOrInvalidDeclarationInModule

import { Directive, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[ngModel]',
  exportAs: 'ngModel'
})
export class MockNgModelDirective {
  @Input() ngModel: any;
  @Input() disabled: any;
  @Input() name: any;
  @Input() ngModelOptions: any;
  @Output() ngModelChange = new EventEmitter();
}
